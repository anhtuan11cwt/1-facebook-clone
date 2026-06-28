import { v2 as cloudinary } from "cloudinary";

import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Bio from "../models/Bio.js";
import User from "../models/User.js";
import responseHandler from "../utils/responseHandler.js";

const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/upload/");
  if (segments.length < 2) return null;
  const afterUpload = segments[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const lastDot = withoutVersion.lastIndexOf(".");
  return lastDot !== -1 ? withoutVersion.slice(0, lastDot) : withoutVersion;
};

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userIdToFollow } = req.body;

    if (currentUserId === userIdToFollow) {
      return responseHandler(res, 400, "Không thể tự follow chính mình");
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userIdToFollow);

    if (!currentUser || !targetUser) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    if (currentUser.following.includes(userIdToFollow)) {
      return responseHandler(res, 400, "Bạn đã kết bạn với người dùng này rồi");
    }

    currentUser.following.push(userIdToFollow);
    currentUser.followingCount = currentUser.following.length;

    targetUser.followers.push(currentUserId);
    targetUser.followerCount = targetUser.followers.length;

    await currentUser.save();
    await targetUser.save();

    return responseHandler(res, 200, "Follow thành công");
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userIdToUnfollow } = req.body;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userIdToUnfollow);

    if (!currentUser || !targetUser) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow,
    );
    currentUser.followingCount = Math.max(0, currentUser.following.length);

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId,
    );
    targetUser.followerCount = Math.max(0, targetUser.followers.length);

    await currentUser.save();
    await targetUser.save();

    return responseHandler(res, 200, "Hủy follow thành công");
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const deleteUserFromRequest = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { senderId } = req.body;

    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    if (!currentUser || !sender) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== senderId,
    );
    currentUser.followerCount = Math.max(0, currentUser.followers.length);

    sender.following = sender.following.filter(
      (id) => id.toString() !== currentUserId,
    );
    sender.followingCount = Math.max(0, sender.following.length);

    await currentUser.save();
    await sender.save();

    return responseHandler(res, 200, "Đã từ chối lời mời kết bạn");
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    const requests = currentUser.followers.filter(
      (id) => !currentUser.following.includes(id),
    );

    const friendRequests = await User.find({
      _id: { $in: requests },
    }).select("username email profilePicture");

    return responseHandler(
      res,
      200,
      "Lấy danh sách lời mời kết bạn thành công",
      friendRequests,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllUsersForRequest = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    const excludeIds = [
      currentUserId,
      ...currentUser.followers.map((id) => id.toString()),
      ...currentUser.following.map((id) => id.toString()),
    ];

    const users = await User.find({
      _id: { $nin: excludeIds },
    }).select("username email profilePicture");

    return responseHandler(
      res,
      200,
      "Lấy danh sách gợi ý kết bạn thành công",
      users,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllMutualFriends = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    const followingSet = new Set(
      currentUser.following.map((id) => id.toString()),
    );

    const mutualIds = currentUser.followers.filter((id) =>
      followingSet.has(id.toString()),
    );

    const mutualFriends = await User.find({
      _id: { $in: mutualIds },
    }).select("username email profilePicture");

    return responseHandler(
      res,
      200,
      "Lấy danh sách bạn chung thành công",
      mutualFriends,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").populate("bio");

    return responseHandler(
      res,
      200,
      "Lấy danh sách người dùng thành công",
      users,
    );
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.userId;

    const user = await User.findById(userId)
      .select("-password")
      .populate("bio");

    if (!user) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    const isOwner = currentUserId === userId;

    return responseHandler(res, 200, "Lấy thông tin người dùng thành công", {
      isOwner,
      user,
    });
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const createOrUpdateBio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    const { bioText, phone, relationship } = data;

    if (bioText && bioText.length > 200) {
      return responseHandler(
        res,
        400,
        "Giới thiệu không được vượt quá 200 ký tự",
      );
    }

    if (phone && !/^0\d{8,9}$/.test(phone)) {
      return responseHandler(
        res,
        400,
        "Số điện thoại phải có 9-10 số và bắt đầu bằng số 0",
      );
    }

    if (relationship) {
      const validRelationships = [
        "single",
        "married",
        "in a relationship",
        "engaged",
        "divorced",
        "widowed",
      ];
      if (!validRelationships.includes(relationship)) {
        return responseHandler(res, 400, "Trạng thái quan hệ không hợp lệ");
      }
    }

    let bio;
    if (user.bio) {
      bio = await Bio.findByIdAndUpdate(user.bio, data, { new: true });
    } else {
      bio = await Bio.create(data);
      user.bio = bio._id;
      await user.save();
    }

    return responseHandler(res, 200, "Cập nhật tiểu sử thành công", bio);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;
    const { dateOfBirth, gender, username } = req.body;

    if (username && username.trim().length < 3) {
      return responseHandler(
        res,
        400,
        "Tên người dùng phải có ít nhất 3 ký tự",
      );
    }

    if (gender && !["male", "female"].includes(gender)) {
      return responseHandler(res, 400, "Giới tính không hợp lệ");
    }

    if (dateOfBirth) {
      const age = Math.floor(
        (Date.now() - new Date(dateOfBirth).getTime()) / 31557600000,
      );
      if (age < 18) {
        return responseHandler(res, 400, "Bạn phải đủ 18 tuổi");
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    if (username) user.username = username.trim();
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    if (file) {
      if (user.profilePicture) {
        const publicId = extractPublicIdFromUrl(user.profilePicture);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        }
      }
      const uploadResult = await uploadFileToCloudinary(
        file,
        "1-facebook-clone/profile",
      );
      user.profilePicture = uploadResult.secure_url;
    }

    await user.save();

    return responseHandler(res, 200, "Cập nhật hồ sơ thành công", user);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return responseHandler(res, 400, "Vui lòng chọn ảnh bìa");
    }

    const user = await User.findById(userId);
    if (!user) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    if (user.coverPhoto) {
      const publicId = extractPublicIdFromUrl(user.coverPhoto);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }
    }

    const uploadResult = await uploadFileToCloudinary(
      file,
      "1-facebook-clone/cover",
    );

    user.coverPhoto = uploadResult.secure_url;
    await user.save();

    return responseHandler(res, 200, "Cập nhật ảnh bìa thành công", user);
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};

export const checkUserAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("bio");

    if (!user) {
      return responseHandler(res, 404, "Không tìm thấy người dùng");
    }

    return responseHandler(res, 200, "Xác thực thành công", {
      authenticated: true,
      user,
    });
  } catch (error) {
    return responseHandler(res, 500, error.message);
  }
};
