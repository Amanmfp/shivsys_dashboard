// routes/notice.routes.js
import { Router } from 'express';
import {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    getRecentNotices,
    getNoticesByCategory
} from '../controllers/notice.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyAdminJWT } from '../middlewares/admin.middleware.js'

const router = Router();

router.route('/').get(verifyJWT, getAllNotices);      // if active true thgen only return notice list
router.route('/recent').get(verifyJWT, getRecentNotices);
router.route('/category/:category').get(verifyJWT, getNoticesByCategory);   // give by general, important etc as mentioned in category 
router.route('/:id').get(verifyJWT, getNoticeById);

// Admin-only routes
router.route('/create').post(verifyAdminJWT, createNotice);
router.route('/:id')
    .put(verifyAdminJWT, updateNotice)
    .delete(verifyAdminJWT, deleteNotice);

export default router;