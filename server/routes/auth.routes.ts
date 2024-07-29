import { Router, type RequestHandler } from 'express';
import {
    login,
    logout,
    profile,
    register,
} from '../controllers/auth.controller';
const router = Router();
// Add paths here   
router.post('/login', login);
router.post('/register',register);
router.get('/logout', logout);
router.get('/profile/:id',profile as RequestHandler);


export default router;