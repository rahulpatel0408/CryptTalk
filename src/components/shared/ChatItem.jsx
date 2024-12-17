import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Divider, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name = "",
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        sx={{
          alignItems: "center",
          justifyContent: 'center',
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          gap: "1rem",
          position: "relative",
          "&:hover": {
            backgroundColor: "#ffffff",
          }
        }}>
        <Box
          sx={{
            // alignItems: "center",
            // justifyContent: 'center',
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            margin: '5px',
            width:"100%",
            backgroundColor: sameSender ? "#555555" : "#ffffff",
            color: sameSender ? "white" : "#333333",
            gap: "1rem",
            position: "relative",
            borderRadius: '25px',
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: 'scale(1.02)',
              backgroundColor: sameSender ? "#333333" : "#efefef",
            },
          }}
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
          }}>
            
            <AvatarCard avatar={avatar} />
            <Stack>
              <Typography sx={{marginRight:"2rem",
                fontSize:"18px",
              }}>{name}</Typography>
              {newMessageAlert && (
                <Typography>{newMessageAlert.count} New Message</Typography>
              )}
            </Stack>
          </Box>
          {isOnline && (
            <Box
              sx={{
                position: "absolute",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </Box>
      </Box>
      <Divider  variant="middle" flexItem></Divider>
    </Link>
  );
};

export default memo(ChatItem);
