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
