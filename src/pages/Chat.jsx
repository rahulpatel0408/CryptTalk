// ✅ Final working Chat.jsx with persistent key storage and mutual key exchange
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dailogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  STOP_TYPING,
} from "../components/constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { START_TYPING } from "../../server/constants/events";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

import {
  generateKeyPair,
  exportPublicKey,
  importPublicKey,
  deriveSharedSecret,
  encryptMessage,
  decryptMessage,
  saveKeyPair,
  loadKeyPair,
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

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const [sharedSecret, setSharedSecret] = useState(null);
  const myKeyPairRef = useRef(null);
  const publicKeySentRef = useRef(false);

  useEffect(() => {
    socket.emit("join-room", { chatId });
    publicKeySentRef.current = false;

    const initKeys = async () => {
      let keyPair = await loadKeyPair(chatId);
      if (!keyPair) {
        keyPair = await generateKeyPair();
        await saveKeyPair(chatId, keyPair);
      }
      myKeyPairRef.current = keyPair;

      const myPublicKey = await exportPublicKey(keyPair.publicKey);
      console.log("📤 Sending my public key:", myPublicKey);
      socket.emit("public-key", { chatId, key: myPublicKey });
    };

    initKeys();

    socket.on("public-key", async ({ key }) => {
      console.log("🔑 Received public key:", key);
      if (!myKeyPairRef.current) return;
      const otherPublicKey = await importPublicKey(key);
      const secret = await deriveSharedSecret(myKeyPairRef.current.privateKey, otherPublicKey);
      console.log("✅ Shared secret derived");
      setSharedSecret(secret);

      if (!publicKeySentRef.current) {
        const myPublicKey = await exportPublicKey(myKeyPairRef.current.publicKey);
        console.log("📤 Echoing my public key:", myPublicKey);
        socket.emit("public-key", { chatId, key: myPublicKey });
        publicKeySentRef.current = true;
      }
    });

    return () => {
      socket.off("public-key");
    };
  }, [chatId]);

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
  }, [chatId]);

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
    if (!message.trim() || !sharedSecret) {
      console.warn("Cannot send: missing message or sharedSecret");
      return;
    }

    try {
      const encryptedObject = await encryptMessage(message, sharedSecret);
      const encrypted = JSON.stringify(encryptedObject);
      console.log("🔐 Encrypted message:", encrypted);
      socket.emit(NEW_MESSAGE, { chatId, members, message: encrypted });
      setMessage("");
    } catch (err) {
      console.error("❌ Error encrypting message:", err);
    }
  };

  const newMessageHandler = useCallback(
    async (data) => {
      if (data.chatId !== chatId) return;
      if (!sharedSecret) return;
      try {
        const decrypted = await decryptMessage(data.message.content, sharedSecret);
        console.log("📩 Decrypted message:", decrypted);
        setMessages((prev) => [...prev, { ...data.message, content: decrypted }]);
      } catch (err) {
        console.error("❌ Decryption failed:", err);
      }
    },
    [chatId, sharedSecret]
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
        sender: { _id: "admin", name: "Admin" },
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
      <Stack ref={containerRef} padding="1rem" spacing="1rem" height="90%" sx={{ overflowY: "auto" }}>
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        {userTyping && <TypingLoader sender={message.sender} />}
        <div ref={bottomRef} />
      </Stack>
      <form style={{ height: "10%", backgroundColor: "#FFFFFF" }}>
        <Stack direction="row" height="100%" alignItems="center" position="relative">
          <IconButton sx={{ position: "absolute", marginLeft: "1rem" }} onClick={handleFileOpen}>
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
            sx={{ bgcolor: "orange", color: "white", marginRight: "1rem", padding: "0.5rem", "&:hover": { bgcolor: "error.dark" } }}
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