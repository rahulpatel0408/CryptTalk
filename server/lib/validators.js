import { body, check, param, validationResult, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const registerValidator= () => [
    body("name", "Please enter name").notEmpty(),
    body("bio", "Please enter bio").notEmpty(),
    body("password", "Please enter password").notEmpty(),
    body("username", "Please enter username").notEmpty(),
];

const loginValidator= () => [
    body("password", "Please enter password").notEmpty(),
    body("username", "Please enter username").notEmpty()
];
 
const newGroupValidator= () => [
    body("name", "Please enter password").notEmpty(),
    body("members")
    .notEmpty().withMessage("Please enter members")
    .isArray({min:2, max:100}).withMessage("Group size must be between 3-100")
];

const addMembersValidator = () => [
    body("chatId", "Please enter chatId").notEmpty(),
    body("members")
    .notEmpty().withMessage("Please enter members")
    .isArray({min:1, max:97}).withMessage("Group size must be between 3-100")
];

const removeMembersValidator = () => [
    body("chatId", "Please enter chatId").notEmpty(),
    body("userId")
    .notEmpty().withMessage("Please enter member")
    
];

const leaveGroupValidator = () => [
    param("id", "Please enter chatId").notEmpty(),
];

const sendAttachmentsValidator = () =>[
    body("chatId", "Please enter chatId").notEmpty(),
];

const chatIdValidator = () =>[
    param("id", "Please enter chatId").notEmpty(),
];

const renameValidator = () =>[
    param("id", "Please enter chatId").notEmpty(),
    body("name", "Please enter new name").notEmpty(),
];

const sendRequestValidator = () =>[
    body("userId", "Please enter userID").notEmpty(),
];

const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
      .notEmpty()
      .withMessage("Please Add Accept")
      .isBoolean()
      .withMessage("Accept must be a boolean"),
];

const validateHandler =(req, res, next)=>{
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error)=>error.msg).join(", ");
    console.log(errorMessages);
    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400));
}

export {
    registerValidator, 
    validateHandler, 
    loginValidator, 
    newGroupValidator, 
    addMembersValidator, 
    removeMembersValidator, 
    leaveGroupValidator, 
    sendAttachmentsValidator,
    chatIdValidator,
    renameValidator,
    sendRequestValidator,
    acceptRequestValidator,
};