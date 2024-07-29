import { Router } from "express";
import {
  login,
  logout,
  register,
  addEditor,
} from "../controllers/auth.controller.ts";
const router = Router();
// Add paths here
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/addEditor", addEditor);

export default router;
