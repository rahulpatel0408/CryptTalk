import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import {Add as AddIcon} from "@mui/icons-material"
const UserItem = ({ user, handler, handlerIsLoading,isAdded=false, styling={},}) => {
  const { name, _id, avatar } = user;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width:"100%"
          }}
        >
          {name}
        </Typography>
        <IconButton
        size="small"
        sx={{
            bgcolor:"primary.maoin",
            color:"white",
            "&:hover":{
                bgcolor:"primary.dark",
            },
        }}
        onClick={() => handler(_id)} disabled={handlerIsLoading}>
          <AddIcon sx={{
            color:"blue"
          }}/>
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
