import jwt from "jsonwebtoken";
import createError from "../utils/error.js";
import type { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(req);
  const token = req.cookies.access_token;
  console.log(req.cookies);
  if (!token) {
    return next(createError(401, "You are not Authenticated"));
  }
  jwt.verify(
    token,
    process.env.JWT_SECRETKEY || "default-secret-key",
    (err: Error | null, user: any) => {
      if (err) {
        return next(createError(403, "Token is not valid"));
      }
      req.user = user;
      next();
    }
  );
};
// type userCheck = () => void;
// export const verifyUser = (req:CustomRequest, res:Response, next:NextFunction) => {
//     verifyToken(req, res, next, () => {
//         if (req.user.id != req.params.uid) {
//             return next(createError(403, 'You are not authorized'));
//         }
//     });
// };
