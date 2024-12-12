import express from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentMulter, singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

//after here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new", newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmember", addMembers);
app.put("/removemember", removeMember);
app.delete("/leave/:id", leaveGroup);
//send attachments
app.post("/message", attachmentMulter, sendAttachments);
//get messages
app.get("/message/:id", getMessages);
//to get chat details, rename,delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);
export default app;
