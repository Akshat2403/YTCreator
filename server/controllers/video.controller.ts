import { PrismaClient } from "@prisma/client";
import {
  createOAuth2Client,
  getToken,
  getAuthUrl,
  uploadVideo,
  setCredentials,
} from "../utils/youtubeUpload";
import { type NextFunction, type Request, type Response } from "express";
import createError from "../utils/error";
import { decryptData } from "../utils/encryption";
const prisma = new PrismaClient();
export const youtubeAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { Creator: { include: { credentials: true } } },
  });
  if (!user) {
    return next(createError(404, "User not found"));
  }
  if (!user.Creator) {
    return next(createError(404, "Creator not found"));
  }
  if (!user.Creator.credentials) {
    return next(createError(404, "Credentials not found"));
  }
  const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
  const encryption_method = "aes-256-cbc";

  const cred = decryptData(
    user.Creator.credentials.key,
    req.body.secret_key,
    secret_iv,
    encryption_method
  );
  console.log(cred.web.client_id);

  const oauth2Client = createOAuth2Client(
    cred.web.client_id,
    cred.web.client_secret,
    "http://localhost:3000/upload"
  );
  const url = getAuthUrl(oauth2Client);
  res.send({ url });
};

export const uploadyoutubeVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { Creator: { include: { credentials: true } } },
  });
  if (!user) {
    return next(createError(404, "User not found"));
  }
  if (!user?.Creator?.credentials) {
    return next(createError(404, "Credentials not found"));
  }
  const Job = await prisma.job.findUnique({
    where: { id: req.params.Jobid },
    include: { Video: true },
  });
  console.log(Job);
  if (!Job) return next(createError(404, "Job not found"));
  if (!Job.Video) return next(createError(404, "Video not found"));
  const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
  const encryption_method = "aes-256-cbc";

  const cred = decryptData(
    user.Creator.credentials.key,
    req.body.secret_key,
    secret_iv,
    encryption_method
  );

  const oauth2Client = createOAuth2Client(
    cred.web.client_id,
    cred.web.client_secret,
    "http://localhost:3000/upload"
  );

  const { code } = req.body;
  console.log(code);
  const video = Job.Video.url;
  try {
    const tokens = await getToken(oauth2Client, code);
    console.log(tokens);
    setCredentials(oauth2Client, {
      refresh_token: tokens.refresh_token,
    });
    const videoData = await uploadVideo(
      oauth2Client,
      video,
      title,
      description
      //   privacyStatus
    );
    res.send(videoData);
  } catch (err) {
    console.error("Error: " + err);
    next(createError(500, "Error uploading video"));
  }
};
export const uploadVideoEditor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    description,
    category,
    forKids,
    thumbnail,
    tags,
    formats,
    isVerified,
    privacyStatus,
  } = req.body;
  const { Jobid } = req.params;
  const CreatorDetails = await prisma.job.findUnique({
    where: { id: Jobid },
    include: { Creator: true },
  });

  if (!CreatorDetails) next;
  const video = await prisma.video.create({
    data: {
      title,
      description,
      category,
      url: req.file?.filename ?? "",
      forKids: forKids === "true" ? true : false,
      thumbnail,
      tags,
      formats,
      isVerified: isVerified === "true" ? true : false,
      privacyStatus,
      Creator: {
        connect: { id: CreatorDetails?.Creator.id },
      },
    },
  });
  const job = await prisma.job.update({
    where: {
      id: Jobid,
    },
    data: {
      Video: {
        connect: { id: video.id },
      },
    },
  });
  res.status(201).json("Video uploaded successfully");
};
