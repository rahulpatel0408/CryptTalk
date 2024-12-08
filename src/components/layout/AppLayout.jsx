import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2,Box, Divider } from "@mui/material";
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
        <Box >
        <Grid2
          container
          sx={{
            height:"calc(100vh - 65px)",
            flexgrow:1,
            display:'flex',
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
          <Divider orientation="vertical" variant="middle" flexItem></Divider>
          <Grid2 sx={{ flexGrow: 1 }} height={"100%"} bgcolor="#f3f4f6">
            <WrappedComponent {...props} />
          </Grid2>
        </Grid2>
        </Box>
      </>
    );
  };
};

export default AppLayout;
