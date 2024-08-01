import { Router, type NextFunction, type Request, type Response } from "express";
import { createJob, deleteJob, getAllEditors, getAllJobs, readJob, updateJob } from "../controllers/job.controller.js";
import { validateCreatorRole } from "../middlewares/validCreator.js";
import { verifyUser } from "../middlewares/verification.js";

const router = Router();

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

router.post("/createJob", verifyUser, createJob as RequestHandler);
router.get("/readJob/:id", readJob as RequestHandler);
router.put("/updateJob/:id", updateJob as RequestHandler);
router.delete("/deleteJob/:id", deleteJob as RequestHandler);
router.get("/allJobs",verifyUser, getAllJobs as RequestHandler);
// router.get("/getJob/:id", getJob as RequestHandler);
router.get("/getAllEditors", verifyUser, getAllEditors as RequestHandler);
export default router;