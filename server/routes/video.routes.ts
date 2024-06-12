import { Router } from "express";
import {
  uploadyoutubeVideo,
  youtubeAuth,
} from "../controllers/video.controller.ts";
import upload from "../utils/upload.ts";
import { verifyUser } from "../middlewares/verification.ts";

const router = Router();
router.post("/auth/:uid", verifyUser, youtubeAuth);
router.post(
  "/upload/:uid",
  verifyUser,
  upload.single("video"),
  uploadyoutubeVideo
);
export default router;
