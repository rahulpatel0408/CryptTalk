import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, //15days
  sameSite: "none",
  httpOnly: true,
  secure: true,
};
const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "CryptTalk" })
    .then((data) => {
      console.log(`connected to DB:${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  return res.status(code).cookie("ChatCrypt-token", token, cookieOptions).json({
    success:true,
    message,
  });
};

export { connectDB, sendToken, cookieOptions };
