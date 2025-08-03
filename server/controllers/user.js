import { compare } from "bcrypt";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio, publicKey } = req.body;

  const file = req.file;
  if (!file) return next(new ErrorHandler("Please upload Avatar"));

  if (!publicKey) return next(new ErrorHandler("Public key is required"));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
    publicKey,
  });
  // console.log(user, "here")
  sendToken(res, user, 201, "user created");
});

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
  res
    .status(200)
    .cookie("ChatCrypt-token", "", {...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "logout successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name = "" } = req.query;

  const myChats = await Chat.find({ groupChat: false, members: req.user });
  const myFriends = myChats.map((chat) => chat.members).flat(); //also contains taht user several times
  const restUsers = await User.find({
    _id: { $nin: myFriends },
    name: { $regex: name, $options: "i" },
  });
  const users = restUsers.map(({ _id, name, avatar, publicKey }) => ({
    _id,
    name,
    avatar: avatar.url,
    publicKey,
  }));
  // console.log(users, "here")
  res
    .status(200)
    .json({
      success: true,
      users,
    });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;
  const request = await Request.findById(requestId);
  const receiver_ = await User.findById(request.receiver);
  const sender_ = await User.findById(request.sender);
  
  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (receiver_._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [sender_._id, receiver_._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${sender_.name}-${receiver_.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: sender_._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getOtherMembers = (memebers, userId) => {
  return memebers.find(
    (members) => members._id.toString() !== userId.toString()
  );
};

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMembers(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
      publicKey: otherUser.publicKey,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  getMyFriends,
  getMyNotifications,
  acceptFriendRequest,
};
