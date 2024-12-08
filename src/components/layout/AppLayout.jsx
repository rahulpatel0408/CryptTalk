import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2 } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/SampleData2";
import { useParams } from "react-router-dom";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat",_id, groupChat);
    }
    return (
      <>
        <Title />
        <Header />
        <Grid2
          container
          sx={{
            marginTop: "65px",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Grid2
            size={3}
            height={"100%"}
            sx={{
              display: { xs: "none", sm: "block" },
              bgcolor: "#FFFFFF",
            }}
          >
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </Grid2>
          <Grid2 size={9} height={"100%"} bgcolor="#f3f4f6">
            <WrappedComponent {...props} />
          </Grid2>
        </Grid2>
      </>
    );
  };
};

export default AppLayout;
