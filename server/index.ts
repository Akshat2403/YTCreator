import express, {
  Router,
  type Express,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import credentialRoutes from "./routes/credentials.routes.ts";
import jobRoutes from "./routes/job.routes.ts";
import authRoutes from "./routes/auth.routes.ts";
import videoRoutes from "./routes/video.routes.ts";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/video", videoRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
