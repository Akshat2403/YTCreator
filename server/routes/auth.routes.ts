import { Router, type RequestHandler } from "express";
import {
  login,
  logout,
  register,
  addEditor,
  profile,
  getAllEdtiors,
  getUser,
} from "../controllers/auth.controller.ts";
import { verifyUser } from "../middlewares/verification.ts";
const router = Router();
// Add paths here
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/addEditor", verifyUser, addEditor);
router.get("/profile/", verifyUser, profile as RequestHandler);
router.get("/getAllEdtiors", getAllEdtiors as RequestHandler);
router.get("/user", verifyUser, getUser);

export default router;
