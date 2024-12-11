import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["ChatCrypt-token"];
  //   console.log(req.cookies);
  if (!token) {
    return next(new ErrorHandler("please login to access the route", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;
  next();
});
export { isAuthenticated };
