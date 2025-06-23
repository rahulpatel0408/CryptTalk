import express from "express";
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { corseOption } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";

configDotenv({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const userSocketIDs = new Map();
const onlineUsers = new Set();
connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: corseOption,
});

app.set("io", io);

//using midddlewares here
app.use(express.json());
app.use(cookieParser());
app.use(cors(corseOption));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;
  // console.log(user)
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    console.log(chatId, members, message);
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });
  // User joins a chat room to enable scoped broadcasting (for E2EE key exchange)
  socket.on("join-room", ({ chatId }) => {
    socket.join(chatId);
  });

  // Relay Diffie-Hellman public key to other users in the same chat room
  socket.on("public-key", ({ chatId, key }) => {
    // Send to all other users in the same room
    socket.to(chatId).emit("public-key", { key });
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    // console.log("start - typing", chatId);
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    // console.log("stop - typing", chatId);
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

export { userSocketIDs };
