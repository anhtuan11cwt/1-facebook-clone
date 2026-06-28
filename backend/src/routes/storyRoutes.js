import { Router } from "express";

import {
  createStory,
  deleteStory,
  getAllStories,
} from "../controllers/storyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

const router = Router();

/**
 * @openapi
 * /stories:
 *   post:
 *     tags:
 *       - Stories
 *     summary: Tạo story mới (bắt buộc có ảnh/video)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh hoặc video
 *             required:
 *               - media
 *     responses:
 *       201:
 *         description: Tạo story thành công
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
 *                   example: Tạo story thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     mediaUrl:
 *                       type: string
 *                     mediaType:
 *                       type: string
 *                       enum: [image, video]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Thiếu file media
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
 *                   example: Vui lòng chọn ảnh/video cho story
 *                 data:
 *                   nullable: true
 *                   example: null
 *   get:
 *     tags:
 *       - Stories
 *     summary: Lấy tất cả story
 *     responses:
 *       200:
 *         description: Danh sách story
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
 *                   example: Lấy danh sách story thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           profilePicture:
 *                             type: string
 *                             nullable: true
 *                       mediaUrl:
 *                         type: string
 *                       mediaType:
 *                         type: string
 *                         enum: [image, video]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: number
 *                         example: 0
 */
/**
 * @openapi
 * /stories/{storyId}:
 *   delete:
 *     tags:
 *       - Stories
 *     summary: Xóa story (kèm media trên Cloudinary)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789abc005
 *     responses:
 *       200:
 *         description: Xóa story thành công
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
 *                   example: Xóa story thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Không phải chủ story
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
 *                   example: Bạn không có quyền xóa story này
 *                 data:
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy story
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
 *                   example: Không tìm thấy story
 *                 data:
 *                   nullable: true
 *                   example: null
 */
router.post("/", authMiddleware, multerMiddleware.single("media"), createStory);
router.get("/", getAllStories);
router.delete("/:storyId", authMiddleware, deleteStory);

export default router;
