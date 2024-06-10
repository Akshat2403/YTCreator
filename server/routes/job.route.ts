import { Router, type NextFunction, type Request, type Response } from "express";
import { createJob, deleteJob, readJob, updateJob } from "../controllers/job.controller.js";
import { validateEditorRole } from "../middlewares/validEditor.js";

const router = Router();

type RequestHandler = (req: Request, res: Response,next:NextFunction) => void;

router.post("/createJob", validateEditorRole as RequestHandler, createJob as RequestHandler);
router.get("/readJob/:id", readJob as RequestHandler);
router.put("/updateJob/:id", validateEditorRole as RequestHandler, updateJob as RequestHandler);
router.delete("/deleteJob/:id", deleteJob as RequestHandler);
export default router;