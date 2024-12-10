import { User } from "../models/user.js";

const newUser = async (req, res) => {
  const avatar = {
    public_id: "sdfs",
    url: "sdagd",
  };
  await User.create({
    name: "rahul",
    username: "extreme",
    password: "abcde",
    avatar,
  });
  res.status(201).json({ message: "user created successfully" });
};
const login = (req, res) => {
  res.send("hello world");
};
export { login, newUser };
