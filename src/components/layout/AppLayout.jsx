import React, { useCallback, useEffect, useSyncExternalStore } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2, Box, Divider, Skeleton, Drawer } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/SampleData2";
import { useParams } from "react-router-dom";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
} from "../constants/events";
import {
  incrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessageAlert } = useSelector((state) => state.chat);
    // console.log("newMessageAlert", newMessageAlert);
    const socket = getSocket();
    console.log(socket.id);
    const { isLoading, data, isError, error } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlert });
    }, [newMessageAlert]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertHandler = useCallback(
      (data) => {
        console.log(data);
        console.log(chatId);
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);

    const eventsHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
    };
    useSocketEvents(socket, eventsHandlers);

    return (
      <>
        <Title />
        <Header />
        {isLoading ? (
          <Skeleton>Loading...</Skeleton>
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessageAlert}
            />
          </Drawer>
        )}
        <Box>
          <Grid2
            container
            sx={{
              height: "calc(100vh - 65px)",
              flexgrow: 1,
              display: "flex",
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
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessageAlert}
                />
              )}
            </Grid2>
            <Divider orientation="vertical" variant="middle" flexItem></Divider>
            <Grid2 sx={{ flexGrow: 1 }} height={"100%"} bgcolor="#f3f4f6">
              <WrappedComponent {...props} chatId={chatId} user={user} />
            </Grid2>
          </Grid2>
        </Box>
      </>
    );
  };
};

export default AppLayout;
