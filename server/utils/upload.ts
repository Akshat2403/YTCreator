import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../assets/video");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const name = file.originalname.split(".")[0];
    const ext = file.originalname.split(".")[1];
    cb(null, `${name}-${Date.now()}--${randomUUID()}.${ext}`);
  },
});
const upload = multer({ storage: multerStorage });

export default upload;
