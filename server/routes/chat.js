import express from "express";
import { addMembers, getMyChats, getMyGroups, newGroupChat, removeMember } from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

//after here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new", newGroupChat)
app.get("/my", getMyChats)
app.get("/my/groups", getMyGroups)
app.get("/addmember", addMembers)
app.get("/removemember", removeMember)

export default app;
