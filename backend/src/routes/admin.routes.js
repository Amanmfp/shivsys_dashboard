import { Router } from 'express';
import {
    addAdmin,
    loginAdmin,
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    changeAdmin
} from '../controllers/admin.controller.js';
import { verifyAdminJWT } from '../middlewares/admin.middleware.js';

const router = Router();

router.post("/add-admin", addAdmin);
router.post("/login-admin", loginAdmin);
router.post('/employees', verifyAdminJWT, createEmployee);
router.get('/employees', verifyAdminJWT, getAllEmployees);
router.get('/employees/:id', verifyAdminJWT, getEmployeeById);
router.delete('/employees/:id', verifyAdminJWT, deleteEmployee);
router.post("/change-admin", verifyAdminJWT, changeAdmin);


export default router;
