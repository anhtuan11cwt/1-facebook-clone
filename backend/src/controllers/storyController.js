import { v2 as cloudinary } from "cloudinary";

import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Story from "../models/Story.js";
import responseHandler from "../utils/responseHandler.js";

const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/upload/");
  if (segments.length < 2) return null;
  const afterUpload = segments[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const lastDot = withoutVersion.lastIndexOf(".");
  return lastDot !== -1 ? withoutVersion.slice(0, lastDot) : withoutVersion;
};

export const createStory = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return responseHandler(res, 400, "Vui lòng chọn ảnh/video cho story");
    }

    const uploadResult = await uploadFileToCloudinary(
      req.file,
      "1-facebook-clone/stories",
    );

    let story = await Story.create({
      mediaType: req.file.mimetype.startsWith("image") ? "image" : "video",
      mediaUrl: uploadResult.secure_url,
      user: userId,
    });

    story = await story.populate("user", "username profilePicture");

    return responseHandler(res, 201, "Tạo story thành công", story);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    const story = await Story.findById(storyId);
    if (!story) {
      return responseHandler(res, 404, "Không tìm thấy story");
    }

    if (story.user.toString() !== userId) {
      return responseHandler(res, 401, "Bạn không có quyền xóa story này");
    }

    const publicId = extractPublicIdFromUrl(story.mediaUrl);
    if (publicId) {
      const resourceType = story.mediaType === "video" ? "video" : "image";
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    }

    await Story.findByIdAndDelete(storyId);

    return responseHandler(res, 200, "Xóa story thành công");
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllStories = async (_req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    return responseHandler(res, 200, "Lấy danh sách story thành công", stories);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};
