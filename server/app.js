import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env",
})
const mongoURI=process.env.MONGO_URI;
const PORT = process.env.PORT || 3000
connectDB(mongoURI)
const app = express();
 
app.use("/user",userRoute);

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
