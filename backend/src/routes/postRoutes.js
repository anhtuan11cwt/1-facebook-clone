import { Router } from "express";

import {
  createPost,
  deletePost,
  getAllPosts,
  getPostsByUserId,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

const router = Router();

/**
 * @openapi
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Tạo bài viết mới (kèm ảnh/video)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Xin chào mọi người!"
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh (jpg, png, gif) hoặc video (mp4, mov)
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
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
 *                   example: Tạo bài viết thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665abc123def456789abc001
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 665abc123def456789abc002
 *                         username:
 *                           type: string
 *                           example: tuan123
 *                         profilePicture:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                     content:
 *                       type: string
 *                       example: "Xin chào mọi người!"
 *                     mediaUrl:
 *                       type: string
 *                       nullable: true
 *                       example: "https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/post/abc123.jpg"
 *                     mediaType:
 *                       type: string
 *                       nullable: true
 *                       enum: [image, video]
 *                       example: image
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     likeCount:
 *                       type: number
 *                       example: 0
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 665abc123def456789abc003
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 665abc123def456789abc004
 *                               username:
 *                                 type: string
 *                                 example: anna88
 *                               profilePicture:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                           text:
 *                             type: string
 *                             example: "Bài viết hay quá!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-28T12:30:00.000Z"
 *                       example: []
 *                     commentCount:
 *                       type: number
 *                       example: 0
 *                     shares:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     shareCount:
 *                       type: number
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-28T12:00:00.000Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       401:
 *         description: Chưa đăng nhập
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
router.post("/", authMiddleware, multerMiddleware.single("media"), createPost);

/**
 * @openapi
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Lấy tất cả bài viết (mới nhất trước)
 *     responses:
 *       200:
 *         description: Danh sách bài viết
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
 *                   example: Lấy danh sách bài viết thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc001
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 665abc123def456789abc002
 *                           username:
 *                             type: string
 *                             example: tuan123
 *                           profilePicture:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                       content:
 *                         type: string
 *                         example: "Xin chào mọi người!"
 *                       mediaUrl:
 *                         type: string
 *                         nullable: true
 *                         example: "https://res.cloudinary.com/deef71c3q/image/upload/v1/1-facebook-clone/post/abc123.jpg"
 *                       mediaType:
 *                         type: string
 *                         nullable: true
 *                         enum: [image, video]
 *                         example: image
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       likeCount:
 *                         type: number
 *                         example: 0
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 665abc123def456789abc003
 *                             user:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 665abc123def456789abc004
 *                                 username:
 *                                   type: string
 *                                   example: anna88
 *                                 profilePicture:
 *                                   type: string
 *                                   nullable: true
 *                                   example: null
 *                             text:
 *                               type: string
 *                               example: "Bài viết hay quá!"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-06-28T12:30:00.000Z"
 *                       commentCount:
 *                         type: number
 *                         example: 1
 *                       shares:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       shareCount:
 *                         type: number
 *                         example: 0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:00:00.000Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 */
router.get("/", getAllPosts);

/**
 * @openapi
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Lấy bài viết theo người dùng
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789abc002
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách bài viết của người dùng
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
 *                   example: Lấy bài viết theo người dùng thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665abc123def456789abc001
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 665abc123def456789abc002
 *                           username:
 *                             type: string
 *                             example: tuan123
 *                           profilePicture:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                       content:
 *                         type: string
 *                         example: "Xin chào mọi người!"
 *                       mediaUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       mediaType:
 *                         type: string
 *                         nullable: true
 *                         enum: [image, video]
 *                         example: null
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       likeCount:
 *                         type: number
 *                         example: 0
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 665abc123def456789abc003
 *                             user:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 665abc123def456789abc004
 *                                 username:
 *                                   type: string
 *                                   example: anna88
 *                                 profilePicture:
 *                                   type: string
 *                                   nullable: true
 *                                   example: null
 *                             text:
 *                               type: string
 *                               example: "Bài viết hay quá!"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-06-28T12:30:00.000Z"
 *                       commentCount:
 *                         type: number
 *                         example: 0
 *                       shares:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       shareCount:
 *                         type: number
 *                         example: 0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:00:00.000Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 */
router.get("/user/:userId", getPostsByUserId);

/**
 * @openapi
 * /posts/{postId}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Xóa bài viết (kèm ảnh/video trên Cloudinary)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789abc001
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
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
 *                   example: Xóa bài viết thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Chưa đăng nhập hoặc không phải chủ bài viết
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
 *                   example: Bạn không có quyền xóa bài viết này
 *                 data:
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy bài viết
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
 *                   example: Không tìm thấy bài viết
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.delete("/:postId", authMiddleware, deletePost);

export default router;
