import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary";

configDotenv({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const userSocketIDS = new Map();
connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
}
)

const app = express();

const server = createServer(app);
const io = new Server(server, {});

//using midddlewares here
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:5173","http://localhost:4173", process.env.CLIENT_URL],
  credentials: true,

}))

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

io.use((socket,next)=>{
  //during frontend
})

io.on("connection", (socket) => {
  const user = {
    _id: "asdsda",
    name: "John Doe",
  };

  userSocketIDS.set(user._id.toString(), socket.id);

  console.log(userSocketIDS);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
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
      message: messageForRealTime,
      chatId,
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
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
