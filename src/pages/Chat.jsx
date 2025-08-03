import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dailogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  // START_TYPING,
  STOP_TYPING,
} from "../components/constants/events";
import { START_TYPING } from "../../server/constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import toast from "react-hot-toast";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import {
  getStoredPassphrase,
  generatePrivateKeyFromPassphrase,
  deriveSharedSecret,
  deriveAESKey,
  encryptMessage,
  decryptMessage,
} from "../utils/crypto";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAncho] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, populate: true, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );

  // Decrypt old messages when they are loaded
  useEffect(() => {
    const decryptOldMessages = async () => {
      
      if (!oldMessagesChunk.data?.message || oldMessagesChunk.data.message.length === 0) return;
      const passphrase = getStoredPassphrase();
      if (!passphrase) {
        console.error("Passphrase not found for old messages decryption");
        return;
      }

      try {
        console.log(oldMessagesChunk)
        const decryptedMessages = await Promise.all(
          oldMessagesChunk.data.message.map(async (msg) => {
            try {
              console.log(msg)
              const sender = msg.sender;
              const receiver = msg.receiver[0];
              
              console.log(sender, ": sender")
              if (!sender || !sender.publicKey) {
                console.warn("Sender or public key not found for message:", msg._id);
                return msg;
              }


              const privateKey = generatePrivateKeyFromPassphrase(passphrase);
              const sharedSecret = deriveSharedSecret(privateKey,  user._id==sender._id?receiver.publicKey:sender.publicKey);
              const aesKey = deriveAESKey(sharedSecret);
              const decryptedContent = decryptMessage(msg.content, aesKey);

              return decryptedContent ? { ...msg, content: decryptedContent } : msg;
            } catch (error) {
              console.error("Failed to decrypt message:", msg._id, error);
              return msg;
            }
          })
        );
        setOldMessages(decryptedMessages);
      } catch (error) {
        console.error("Failed to decrypt old messages:", error);
      }
    };

    decryptOldMessages();
  }, [oldMessagesChunk.data?.message, chatDetails.data?.chat?.members, setOldMessages]);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAncho(e.currentTarget);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const passphrase = getStoredPassphrase();
      if (!passphrase) {
        toast.error("Passphrase not found. Please login again.");
        return;
      }

      const otherUser = chatDetails.data?.chat?.members?.find(
        (member) => member._id !== user._id
      );

      if (!otherUser || !otherUser.publicKey) {
        toast.error("Unable to find recipient or public key");
        return;
      }

      const privateKey = generatePrivateKeyFromPassphrase(passphrase);
      const sharedSecret = deriveSharedSecret(privateKey, otherUser.publicKey);
      const aesKey = deriveAESKey(sharedSecret);
      const encryptedMessage = encryptMessage(message, aesKey);

    
      // Emit the encrypted message
      socket.emit(NEW_MESSAGE, {
        chatId,
        members,
        message: encryptedMessage,
      });

      setMessage("");
    } catch (error) {
      console.error("Encryption error:", error);
      toast.error("Failed to encrypt message");
    }
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId, user._id, members, dispatch, setOldMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, oldMessages]);

  useEffect(() => {
    if (chatDetails.isError) navigate("/");
  }, [chatDetails.isError, navigate]);

  const newMessageHandler = useCallback(
    async (data) => {
      console.log(data, "here in new message handler")
      if (data.chatId !== chatId) return;
      try {
        const passphrase = getStoredPassphrase();
        if (!passphrase) {
          console.error("Passphrase not found for decryption");
          return;
        }

        const sender = chatDetails.data?.chat?.members?.find(
          (member) => member._id === data.message.sender._id
        );
        console.log(sender, "here in sender")

        const receiver = chatDetails.data?.chat?.members?.find(
          (member) => member._id !== data.message.sender._id
        );
        console.log(receiver, "here in receiver")
        

        if (!sender || !sender.publicKey) {
          console.warn("Sender or public key not found for incoming message:", data.message._id);
          setMessages((prev) => [...prev, data.message]);
          return;
        }

        const privateKey = generatePrivateKeyFromPassphrase(passphrase);
        const sharedSecret = deriveSharedSecret(privateKey, user._id==sender._id?receiver.publicKey:sender.publicKey);
        const aesKey = deriveAESKey(sharedSecret);
        const decryptedContent = decryptMessage(data.message.content, aesKey);

        const newMessage = decryptedContent
          ? { ...data.message, content: decryptedContent }
          : data.message;

        // Avoid duplicating optimistic messages
        setMessages((prev) =>
          prev.some((msg) => msg._id === newMessage._id)
            ? prev
            : [...prev.filter((msg) => !msg._id.startsWith("temp-")), newMessage]
        );
      } catch (error) {
        console.error("Decryption error:", error);
        setMessages((prev) => [...prev, data.message]);
      }
    },
    [chatId, chatDetails.data?.chat?.members]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "ljsklfdgvsdjklfjv",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventsHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  
  
  useSocketEvents(socket, eventsHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton>Loading...</Skeleton>
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"rgba(247,247,247,1)"}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        {userTyping && <TypingLoader sender={message.sender} />}
        <div ref={bottomRef} />
      </Stack>
      <form style={{ height: "10%", backgroundColor: "#FFFFFF" }}>
        <Stack
          direction={"row"}
          height={"100%"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{ position: "absolute", marginLeft: "1rem" }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here...."
            value={message}
            onChange={messageOnChange}
            sx={{ width: "100%", height: "100%", color: "black" }}
          />
          <IconButton
            type="submit"
            onClick={submitHandler}
            sx={{
              bgcolor: "orange",
              color: "white",
              marginRight: "1rem",
              padding: "0.5rem",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);