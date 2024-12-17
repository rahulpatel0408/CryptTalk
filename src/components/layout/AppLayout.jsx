import React, { useEffect, useSyncExternalStore } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2,Box, Divider, Skeleton, Drawer } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/SampleData2";
import { useParams } from "react-router-dom";
import {useMyChatsQuery} from "../../redux/api/api"
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors } from "../../hooks/hooks";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;
    const{isMobile} = useSelector((state)=>state.misc)
    const { user } = useSelector((state) => state.auth);
    
    const socket = getSocket();
    const {isLoading, data, isError, error, refetch} = useMyChatsQuery("")
    
    
    useErrors([{isError, error}]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat",_id, groupChat);
    }

    const handleMobileClose =()=> dispatch(setIsMobile(false));
    
    return (
      <>
        <Title />
        <Header />
        {
          isLoading ? (<Skeleton>Loading...</Skeleton>):(
            <Drawer open={isMobile} onClose={handleMobileClose}>
              <ChatList 
              w="70vw"
              chats={data?.chats}
              chatId = {chatId}
              handleDeleteChat={handleDeleteChat}
              />
            </Drawer>
          )
        }
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
            {
              isLoading?(<div>Loading...</div>)
                       :(<ChatList
                        chats={data?.chats}
                        chatId={chatId}
                        handleDeleteChat={handleDeleteChat}
                      />)
            }
          </Grid2>
          <Divider orientation="vertical" variant="middle" flexItem></Divider>
          <Grid2 sx={{ flexGrow: 1 }} height={"100%"} bgcolor="#f3f4f6">
            <WrappedComponent {...props} chatId={chatId} user={user}/>
          </Grid2>
        </Grid2>
        </Box>
      </>
    );
  };
};

export default AppLayout;
