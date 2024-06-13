import { Router, type NextFunction, type Request, type Response } from "express";
import { addCredentials, updateCredentials } from "../controllers/credentials.controller.ts";
import multer from "multer";
import { verifyUser } from "../middlewares/verification.ts";
import { decryptData } from "../utils/encryption.ts";

const upload = multer();
const router = Router();

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
router.put("/updateCredentials/:uid", verifyUser, upload.single('file'), updateCredentials as RequestHandler);
router.post("/addCredentials/:uid", verifyUser, upload.single('file'), addCredentials as RequestHandler);

export default router;