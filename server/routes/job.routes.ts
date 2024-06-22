import { Router, type NextFunction, type Request, type Response } from "express";
import { createJob, deleteJob, getAllJobs, getJob, readJob, updateJob } from "../controllers/job.controller.js";
import { validateCreatorRole } from "../middlewares/validCreator.js";

const router = Router();

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

router.post("/createJob/:uid", validateCreatorRole as RequestHandler, createJob as RequestHandler);
router.get("/readJob/:id", readJob as RequestHandler);
router.put("/updateJob/:id", validateCreatorRole as RequestHandler, updateJob as RequestHandler);
router.delete("/deleteJob/:id", deleteJob as RequestHandler);
router.get("/allJobs/:uid", getAllJobs as RequestHandler);
router.get("/getJob/:id", getJob as RequestHandler);
export default router;