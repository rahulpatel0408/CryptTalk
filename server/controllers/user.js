import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  const avatar = {
    public_id: "sdfs",
    url: "sdagd",
  };
  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });
  sendToken(res, user, 201, "user created");
};

// login and cookie saving
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const ismatch = await compare(password, user.password);

  if (!ismatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 201, `welcome back ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  res.status(200).cookie("ChatCrypt-token", "",{...cookieOptions, maxAge:0}).json({
    success: true,
    message: "logout successfully",
  });
});
export { login, newUser, getMyProfile, logout };
