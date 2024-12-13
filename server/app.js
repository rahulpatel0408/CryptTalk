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
configDotenv({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const userSocketIDS = new Map();
connectDB(mongoURI);
// createUser(20);
const app = express();

const server = createServer(app);
const io = new Server(server, {});

//using midddlewares here
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);

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
