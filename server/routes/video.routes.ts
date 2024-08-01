import { Router } from "express";
import {
  uploadyoutubeVideo,
  youtubeAuth,
  uploadVideoEditor,
} from "../controllers/video.controller.ts";
import upload from "../utils/upload.ts";
import { verifyUser } from "../middlewares/verification.ts";

const router = Router();
router.post("/auth", verifyUser, youtubeAuth);
router.post("/upload", verifyUser, uploadyoutubeVideo);
router.post(
  "/editorUpload",
  verifyUser,
  upload.single("video"),
  uploadVideoEditor
);
export default router;
