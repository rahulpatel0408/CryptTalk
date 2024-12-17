import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { useAsyncMutation } from '../../hooks/hooks'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { useNavigate } from 'react-router-dom'


const DeleteChatMenu = ({ dispatch, deleteOptionAnchor }) => {
    const navigate = useNavigate();
    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc)
    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor.current = null;
    }
    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);
    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("deleting chat...", selectedDeleteChat.chatId);
    }
    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("leaving group...", selectedDeleteChat.chatId);
    }
    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/");
    }, [deleteChatData, leaveGroupData])
    const isGroupChat = selectedDeleteChat.groupChat;
    console.log(isGroupChat)
    return (
        <Menu open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteOptionAnchor}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center"
            }}

        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer"
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={isGroupChat ? leaveGroupHandler : deleteChatHandler}
            >
                {
                    isGroupChat
                        ? <><ExitToAppIcon />
                            <Typography color='black'>
                                Leave Group
                            </Typography>
                        </>
                        : <>
                            <DeleteIcon />
                            <Typography color='black'>
                                Delete Chat
                            </Typography>
                        </>
                }

            </Stack>
        </Menu>
    )
}

export { DeleteChatMenu }
