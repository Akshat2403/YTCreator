import express, { Router, type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(userRoutes);
app.use(jobRoutes);



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});