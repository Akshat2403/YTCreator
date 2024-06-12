import { google } from "googleapis";
import { type ParsedQs } from "qs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const OAuth2 = google.auth.OAuth2;
import { Readable } from "stream";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const createOAuth2Client = (
  clientId: string,
  clientSecret: string,
  redirectUrl: string
) => {
  return new OAuth2(clientId, clientSecret, redirectUrl);
};

export const getAuthUrl = (oauth2Client: any) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });
};

export const getToken = async (
  oauth2Client: any,
  code: string | string[] | ParsedQs | ParsedQs[] | undefined
) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const setCredentials = (oauth2Client: any, tokens) => {
  oauth2Client.setCredentials(tokens);
};
export const uploadVideo = async (
  oauth2Client: any,
  videoFile: any,
  title: string,
  description: string,
  privacyStatus = "private"
) => {
  console.log(videoFile);
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const response = await youtube.videos.insert({
    resource: {
      snippet: {
        title: title,
        description: description,
      },
      status: {
        privacyStatus: privacyStatus,
      },
    },
    part: "snippet,status",
    media: {
      body: fs.createReadStream(__dirname + "/../assets/video/" + videoFile),
    },
  });
  fs.unlink(__dirname + "/../assets/video/" + videoFile, (err) => {
    console.log(err);
  });
  return response.data;
};
