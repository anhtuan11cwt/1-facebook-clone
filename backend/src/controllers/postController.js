import { v2 as cloudinary } from "cloudinary";

import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Post from "../models/Post.js";
import responseHandler from "../utils/responseHandler.js";

const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/upload/");
  if (segments.length < 2) return null;
  const afterUpload = segments[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const lastDot = withoutVersion.lastIndexOf(".");
  return lastDot !== -1 ? withoutVersion.slice(0, lastDot) : withoutVersion;
};

export const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content } = req.body;
    const file = req.file;

    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(
        file,
        "1-facebook-clone/post",
      );
      mediaUrl = uploadResult.secure_url;
      mediaType = file.mimetype.startsWith("image") ? "image" : "video";
    }

    const post = await Post.create({
      content,
      mediaType,
      mediaUrl,
      user: userId,
    });

    await post.populate("user", "username profilePicture");

    return responseHandler(res, 201, "Tạo bài viết thành công", post);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    return responseHandler(
      res,
      200,
      "Lấy danh sách bài viết thành công",
      posts,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .populate("user", "username profilePicture")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    return responseHandler(
      res,
      200,
      "Lấy bài viết theo người dùng thành công",
      posts,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return responseHandler(res, 404, "Không tìm thấy bài viết");
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();

      await post.populate("comments.user", "username profilePicture");
      await post.populate("user", "username profilePicture");

      return responseHandler(res, 200, "Đã bỏ thích bài viết", post);
    }

    post.likes.push(userId);
    post.likeCount += 1;
    await post.save();

    await post.populate("comments.user", "username profilePicture");
    await post.populate("user", "username profilePicture");

    return responseHandler(res, 200, "Đã thích bài viết", post);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;
    const file = req.file;

    if (!text) {
      return responseHandler(
        res,
        400,
        "Nội dung bình luận không được để trống",
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return responseHandler(res, 404, "Không tìm thấy bài viết");
    }

    let commentMediaUrl = null;
    let commentMediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(
        file,
        "1-facebook-clone/post/comment",
      );
      commentMediaUrl = uploadResult.secure_url;
      commentMediaType = file.mimetype.startsWith("image") ? "image" : "video";
    }

    post.comments.push({
      mediaType: commentMediaType,
      mediaUrl: commentMediaUrl,
      text,
      user: userId,
    });
    post.commentCount += 1;
    await post.save();

    await post.populate("comments.user", "username profilePicture");
    await post.populate("user", "username profilePicture");

    return responseHandler(res, 201, "Thêm bình luận thành công", post);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return responseHandler(res, 404, "Không tìm thấy bài viết");
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return responseHandler(res, 404, "Không tìm thấy bình luận");
    }

    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return responseHandler(res, 401, "Bạn không có quyền xóa bình luận này");
    }

    if (comment.mediaUrl) {
      const publicId = extractPublicIdFromUrl(comment.mediaUrl);
      if (publicId) {
        const resourceType = comment.mediaType === "video" ? "video" : "image";
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
      }
    }

    post.comments.pull(commentId);
    post.commentCount = Math.max(0, post.commentCount - 1);
    await post.save();

    await post.populate("comments.user", "username profilePicture");
    await post.populate("user", "username profilePicture");

    return responseHandler(res, 200, "Xóa bình luận thành công", post);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return responseHandler(res, 404, "Không tìm thấy bài viết");
    }

    const alreadyShared = post.shares.some((id) => id.toString() === userId);
    if (!alreadyShared) {
      post.shares.push(userId);
    }

    post.shareCount += 1;
    await post.save();

    await post.populate("comments.user", "username profilePicture");
    await post.populate("user", "username profilePicture");

    return responseHandler(res, 200, "Đã chia sẻ bài viết", post);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return responseHandler(res, 404, "Không tìm thấy bài viết");
    }

    if (post.user.toString() !== userId) {
      return responseHandler(res, 401, "Bạn không có quyền xóa bài viết này");
    }

    if (post.mediaUrl) {
      const publicId = extractPublicIdFromUrl(post.mediaUrl);
      if (publicId) {
        const resourceType = post.mediaType === "video" ? "video" : "image";
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
      }
    }

    await Post.findByIdAndDelete(postId);

    return responseHandler(res, 200, "Xóa bài viết thành công");
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};
