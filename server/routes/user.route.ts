import { Router, type NextFunction, type Request, type Response } from "express";
import { addCredentials, createUser, updateCredentials, updateUser } from "../controllers/user.controller.js";
import multer from "multer";

const upload = multer();
const router = Router();

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;


router.put("/updateCredentials", upload.single('file'), updateCredentials as RequestHandler);
router.post("/addCredentials", upload.single('file'), addCredentials as RequestHandler);
router.post("/createUser", createUser as RequestHandler);
router.put("/updateUser", updateUser as RequestHandler);

export default router;