import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dailogs/FileMenu";
import { sampleMessage } from "../components/constants/SampleData2";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../components/constants/events";
import { useChatDetailsQuery } from "../redux/api/api";
import { useSocketEvents } from "../hooks/hooks";

const Chat = ({chatId, user}) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const [message, setMessage] = useState([]);

  
  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId})
  // console.log(chatDetails)
  const members = chatDetails?.data?.chat?.members;
  const submitHandler = (e) =>{
    e.preventDefault();
    if(!message.trim()) return;
    socket.emit(NEW_MESSAGE, {chatId, members,message});
    setMessage("");
  };

  const [messages, setMessages] = useState([]);
  const newMessageHandler = useCallback((data)=>{
    setMessages((prev)=>[...prev, data.message]);
  }, []);
  const eventsHandler = {[NEW_MESSAGE]: newMessageHandler};
  useSocketEvents(socket, eventsHandler);

  return (
    
    chatDetails.isLoading?(<Skeleton>Loading...</Skeleton>):
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
        {messages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </Stack>
      <form
        style={{
          height: "10%",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              marginLeft: "1rem",
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here...."
            value = {message}
            onChange={(e)=>setMessage(e.target.value)}
            sx={{
              width: "100%",
              height: "100%",
              color:"black"
            }}
          />
          <IconButton
            type="submit"
            onClick={submitHandler}
            sx={{
              bgcolor: "orange",
              color: "white",
              marginRight: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  );
};

export default AppLayout()(Chat);
