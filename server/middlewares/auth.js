import { CHATCRYPT_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
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

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies[CHATCRYPT_TOKEN];
    if (!authToken) return next(new ErrorHandler("Please login to access the route", 401));
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);
    if (!user) return next(new ErrorHandler("Please Login to access this route", 401));
    socket.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please ogin to access this route", 401));
  }
};
export { isAuthenticated, socketAuthenticator };
