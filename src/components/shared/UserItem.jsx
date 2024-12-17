import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { Add as AddIcon, PersonAddAlt1Rounded as PersonAddAlt1RoundedIcon, PersonRemoveAlt1Rounded as PersonRemoveAlt1RoundedIcon } from "@mui/icons-material"
import { tranformImage } from "../../lib/features";
const UserItem = ({ user, handler, handlerIsLoading, isAdded = false , styling = {}, }) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem 
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
        
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >
          {name}
        </Typography>
        <IconButton
          size="small"
          sx={{
            bgcolor: "transparent",
            color: "white",
            "&:hover": {
              bgcolor: "rgb(221, 226, 230)",
            },
          }}
          onClick={() => handler(_id)} disabled={handlerIsLoading}>
          {
            isAdded ? <PersonRemoveAlt1RoundedIcon 
            sx={{
              color: "#d32f2f", 
              fontSize: 30, 
              transition: "all 0.3s ease", 
              "&:hover": {
                backgroundColor: "transparent", 
                borderRadius: "50%", 
                cursor: "pointer", 
              },
            }}/> : <PersonAddAlt1RoundedIcon 
            sx={{
              color: "green", 
              fontSize: 30, 
              transition: "all 0.3s ease", 
              "&:hover": {
                backgroundColor: "transparent", 
                borderRadius: "50%", 
                cursor: "pointer", 
              },
            }}/>
          }
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
