import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createUser } from "./seeder/user.js";

configDotenv({
  path: "./.env",
})
const mongoURI=process.env.MONGO_URI;
const PORT = process.env.PORT || 3000
connectDB(mongoURI)
// createUser(20);
const app = express();
 
//using midddlewares here
app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoute);
app.use("/chat",chatRoute);

app.get("/",(req,res)=>{
    res.send("hello world");
})
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
