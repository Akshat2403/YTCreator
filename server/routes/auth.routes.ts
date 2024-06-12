import { Router } from 'express';
import {
    login,
    logout,
    register,
} from '../controllers/auth.controller.ts';
const router = Router();
// Add paths here
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

export default router;