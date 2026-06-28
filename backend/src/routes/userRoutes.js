import { Router } from "express";

import {
  checkUserAuth,
  createOrUpdateBio,
  deleteUserFromRequest,
  followUser,
  getAllFriendRequests,
  getAllMutualFriends,
  getAllUsers,
  getAllUsersForRequest,
  getUserProfile,
  unfollowUser,
  updateCoverPhoto,
  updateUserProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

const router = Router();

/**
 * @openapi
 * /users/follow:
 *   post:
 *     tags:
 *       - Users
 *     summary: Follow người dùng
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToFollow:
 *                 type: string
 *                 example: 665abc123def456789abc002
 *             required:
 *               - userIdToFollow
 *     responses:
 *       200:
 *         description: Follow thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Follow thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Lỗi (tự follow, đã follow, không tìm thấy user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không thể tự follow chính mình
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.post("/follow", authMiddleware, followUser);

/**
 * @openapi
 * /users/unfollow:
 *   post:
 *     tags:
 *       - Users
 *     summary: Hủy follow người dùng
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToUnfollow:
 *                 type: string
 *                 example: 665abc123def456789abc002
 *             required:
 *               - userIdToUnfollow
 *     responses:
 *       200:
 *         description: Hủy follow thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Hủy follow thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người dùng
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.post("/unfollow", authMiddleware, unfollowUser);

/**
 * @openapi
 * /users/delete-request:
 *   post:
 *     tags:
 *       - Users
 *     summary: Từ chối lời mời kết bạn
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 example: 665abc123def456789abc002
 *             required:
 *               - senderId
 *     responses:
 *       200:
 *         description: Đã từ chối
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đã từ chối lời mời kết bạn
 *                 data:
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người dùng
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.post("/delete-request", authMiddleware, deleteUserFromRequest);

/**
 * @openapi
 * /users/friend-requests:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy danh sách lời mời kết bạn
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lời mời
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách lời mời kết bạn thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc003
 *                       username:
 *                         type: string
 *                         example: anna88
 *                       email:
 *                         type: string
 *                         example: anna@gmail.com
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                         example: null
 */
router.get("/friend-requests", authMiddleware, getAllFriendRequests);

/**
 * @openapi
 * /users/suggestions:
 *   get:
 *     tags:
 *       - Users
 *     summary: Gợi ý kết bạn
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Danh sách gợi ý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách gợi ý kết bạn thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc005
 *                       username:
 *                         type: string
 *                         example: minh_tran
 *                       email:
 *                         type: string
 *                         example: minh@gmail.com
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                         example: null
 */
router.get("/suggestions", authMiddleware, getAllUsersForRequest);

/**
 * @openapi
 * /users/mutual-friends:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy danh sách bạn chung
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bạn chung
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bạn chung thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc004
 *                       username:
 *                         type: string
 *                         example: lan_nguyen
 *                       email:
 *                         type: string
 *                         example: lan@gmail.com
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                         example: null
 */
router.get("/mutual-friends", authMiddleware, getAllMutualFriends);

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy tất cả người dùng
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách người dùng thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc002
 *                       username:
 *                         type: string
 *                         example: tuan123
 *                       email:
 *                         type: string
 *                         example: tuan@gmail.com
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                         example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/profile/avatar.jpg
 *                       coverPhoto:
 *                         type: string
 *                         nullable: true
 *                         example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/cover/bg.jpg
 *                       gender:
 *                         type: string
 *                         example: male
 *                       dateOfBirth:
 *                         type: string
 *                         format: date-time
 *                         example: "2000-05-10T00:00:00.000Z"
 *                       followerCount:
 *                         type: number
 *                         example: 15
 *                       followingCount:
 *                         type: number
 *                         example: 23
 *                       bio:
 *                         type: object
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-15T08:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:00:00.000Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 */
router.get("/", getAllUsers);

/**
 * @openapi
 * /users/profile/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy thông tin hồ sơ người dùng
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789abc002
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin người dùng thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     isOwner:
 *                       type: boolean
 *                       example: false
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 665abc123def456789abc002
 *                         username:
 *                           type: string
 *                           example: tuan123
 *                         email:
 *                           type: string
 *                           example: tuan@gmail.com
 *                         profilePicture:
 *                           type: string
 *                           nullable: true
 *                           example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/profile/avatar.jpg
 *                         coverPhoto:
 *                           type: string
 *                           nullable: true
 *                           example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/cover/bg.jpg
 *                         gender:
 *                           type: string
 *                           example: male
 *                         dateOfBirth:
 *                           type: string
 *                           format: date-time
 *                           example: "2000-05-10T00:00:00.000Z"
 *                         followerCount:
 *                           type: number
 *                           example: 15
 *                         followingCount:
 *                           type: number
 *                           example: 23
 *                         followers:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - 665abc123def456789abc003
 *                             - 665abc123def456789abc004
 *                         following:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - 665abc123def456789abc005
 *                             - 665abc123def456789abc006
 *                         bio:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 665abc123def456789abc010
 *                             bioText:
 *                               type: string
 *                               example: "Xin chào, tôi là Tuan"
 *                             liveIn:
 *                               type: string
 *                               example: "Hồ Chí Minh"
 *                             relationship:
 *                               type: string
 *                               example: single
 *                             workPlace:
 *                               type: string
 *                               example: "FPT Software"
 *                             education:
 *                               type: string
 *                               example: "Đại học Bách Khoa"
 *                             phone:
 *                               type: string
 *                               example: "0912345678"
 *                             homeTown:
 *                               type: string
 *                               example: "Hà Nội"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-15T08:30:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-28T12:00:00.000Z"
 *                         __v:
 *                           type: number
 *                           example: 0
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người dùng
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.get("/profile/:userId", authMiddleware, getUserProfile);

/**
 * @openapi
 * /users/bio:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo hoặc cập nhật tiểu sử
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bioText:
 *                 type: string
 *                 example: "Xin chào, tôi là Tuan"
 *               liveIn:
 *                 type: string
 *                 example: "Hồ Chí Minh"
 *               relationship:
 *                 type: string
 *                 example: single
 *               workPlace:
 *                 type: string
 *                 example: "FPT Software"
 *               education:
 *                 type: string
 *                 example: "Đại học Bách Khoa"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               homeTown:
 *                 type: string
 *                 example: "Hà Nội"
 *     responses:
 *       200:
 *         description: Cập nhật tiểu sử thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật tiểu sử thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665abc123def456789abc010
 *                     bioText:
 *                       type: string
 *                       example: "Xin chào, tôi là Tuan"
 *                     liveIn:
 *                       type: string
 *                       example: "Hồ Chí Minh"
 *                     relationship:
 *                       type: string
 *                       example: single
 *                     workPlace:
 *                       type: string
 *                       example: "FPT Software"
 *                     education:
 *                       type: string
 *                       example: "Đại học Bách Khoa"
 *                     phone:
 *                       type: string
 *                       example: "0912345678"
 *                     homeTown:
 *                       type: string
 *                       example: "Hà Nội"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T12:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T12:30:00.000Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Giới thiệu không được vượt quá 200 ký tự"
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.post("/bio", authMiddleware, createOrUpdateBio);

/**
 * @openapi
 * /users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Cập nhật hồ sơ (username, gender, dateOfBirth, profilePicture)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: tuan123
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: male
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-10"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật hồ sơ thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665abc123def456789abc002
 *                     username:
 *                       type: string
 *                       example: tuan123
 *                     email:
 *                       type: string
 *                       example: tuan@gmail.com
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/profile/new_avatar.jpg
 *                     coverPhoto:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     gender:
 *                       type: string
 *                       example: male
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       example: "2000-05-10T00:00:00.000Z"
 *                     followerCount:
 *                       type: number
 *                       example: 15
 *                     followingCount:
 *                       type: number
 *                       example: 23
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T08:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T14:00:00.000Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Tên người dùng phải có ít nhất 3 ký tự"
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.put(
  "/profile",
  authMiddleware,
  multerMiddleware.single("profilePicture"),
  updateUserProfile,
);

/**
 * @openapi
 * /users/cover-photo:
 *   put:
 *     tags:
 *       - Users
 *     summary: Cập nhật ảnh bìa
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverPhoto:
 *                 type: string
 *                 format: binary
 *             required:
 *               - coverPhoto
 *     responses:
 *       200:
 *         description: Cập nhật ảnh bìa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật ảnh bìa thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665abc123def456789abc002
 *                     username:
 *                       type: string
 *                       example: tuan123
 *                     email:
 *                       type: string
 *                       example: tuan@gmail.com
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     coverPhoto:
 *                       type: string
 *                       nullable: true
 *                       example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/cover/new_bg.jpg
 *                     gender:
 *                       type: string
 *                       example: male
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       example: "2000-05-10T00:00:00.000Z"
 *                     followerCount:
 *                       type: number
 *                       example: 15
 *                     followingCount:
 *                       type: number
 *                       example: 23
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T08:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T14:05:00.000Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Thiếu file ảnh bìa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Vui lòng chọn ảnh bìa
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.put(
  "/cover-photo",
  authMiddleware,
  multerMiddleware.single("coverPhoto"),
  updateCoverPhoto,
);

/**
 * @openapi
 * /users/check-auth:
 *   get:
 *     tags:
 *       - Users
 *     summary: Kiểm tra xác thực
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xác thực thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 665abc123def456789abc002
 *                         username:
 *                           type: string
 *                           example: tuan123
 *                         email:
 *                           type: string
 *                           example: tuan@gmail.com
 *                         profilePicture:
 *                           type: string
 *                           nullable: true
 *                           example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/profile/avatar.jpg
 *                         coverPhoto:
 *                           type: string
 *                           nullable: true
 *                           example: https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/cover/bg.jpg
 *                         gender:
 *                           type: string
 *                           example: male
 *                         dateOfBirth:
 *                           type: string
 *                           format: date-time
 *                           example: "2000-05-10T00:00:00.000Z"
 *                         followerCount:
 *                           type: number
 *                           example: 15
 *                         followingCount:
 *                           type: number
 *                           example: 23
 *                         followers:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - 665abc123def456789abc003
 *                             - 665abc123def456789abc004
 *                         following:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - 665abc123def456789abc005
 *                         bio:
 *                           type: object
 *                           nullable: true
 *                           example: null
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-15T08:30:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-28T12:00:00.000Z"
 *                         __v:
 *                           type: number
 *                           example: 0
 *       401:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Vui lòng đăng nhập để tiếp tục
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.get("/check-auth", authMiddleware, checkUserAuth);

export default router;
