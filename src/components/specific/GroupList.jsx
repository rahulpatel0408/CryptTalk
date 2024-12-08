import { Stack, Typography } from "@mui/material";
import React from "react";
import GroupItem from "../shared/GroupItem";

const GroupList = ({
  w = "100%",
  myGroups=[],
  chatId,
  
}) => {
  return (
    <Stack width={w} direction={"column"} >
      {
        myGroups.length>0 ?(
            myGroups.map((group)=><GroupItem
            group={group}
            chatId={chatId}
            sameGroup={chatId === group._id}
            key={group._id}
          />)

        ):(
            <Typography textAlign={"center"}>No groups</Typography>
        )
      }
    </Stack>
  );
};

export default GroupList;
