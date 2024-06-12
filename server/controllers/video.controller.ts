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
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { credentials: true },
  });
  if (!user) {
    return next(createError(404, "User not found"));
  }
  if (!user.credentials) {
    return next(createError(404, "Credentials not found"));
  }
  const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
  const encryption_method = "aes-256-cbc";

  const cred = decryptData(
    user.credentials.key,
    req.body.secret_key,
    secret_iv,
    encryption_method
  );

  const oauth2Client = createOAuth2Client(
    cred.web.clientId,
    cred.web.clientSecret,
    cred.web.redirectUrl
  );
  const url = getAuthUrl(oauth2Client);
  res.send({ url });
};

export const uploadyoutubeVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    clientId,
    clientSecret,
    redirectUrl,
    title,
    description,
    // privacyStatus,
  } = req.body;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { credentials: true },
  });
  if (!user) {
    return next(createError(404, "User not found"));
  }
  if (!user.credentials) {
    return next(createError(404, "Credentials not found"));
  }
  const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
  const encryption_method = "aes-256-cbc";

  const cred = decryptData(
    user.credentials.key,
    req.body.secret_key,
    secret_iv,
    encryption_method
  );

  const oauth2Client = createOAuth2Client(
    cred.web.clientId,
    cred.web.clientSecret,
    cred.web.redirectUrl
  );
  const { code } = req.query;
  console.log(code);
  console.log("file------", req.file);
  const video = req.file?.filename;
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
