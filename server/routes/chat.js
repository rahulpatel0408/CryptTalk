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
import { addMembersValidator, chatIdValidator, leaveGroupValidator, newGroupValidator, removeMembersValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";

const app = express.Router();

//after here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmember", addMembersValidator(), validateHandler, addMembers);
app.put("/removemember",removeMembersValidator(), validateHandler, removeMember);
app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup);
//send attachments
app.post("/message", attachmentMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);
//get messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);
//to get chat details, rename,delete
app.route("/:id")
  .get(getChatDetails, chatIdValidator(), validateHandler)
  .put(renameGroup, renameValidator(), validateHandler)
  .delete(deleteChat, chatIdValidator(), validateHandler);
export default app;
