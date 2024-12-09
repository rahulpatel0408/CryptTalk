import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/SampleData";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {

    const [members,setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const selectMemberHandler = ({ _id }) => {
        setSelectedMembers((prev) =>
            prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
        );
    };

  const closeHandler = () => {
    setSelectedMembers([]);
    setMembers([]);
  };
  const addMemberSubmitHandler=()=>{
    closeHandler();
  };
  return (
    <Dialog open>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack>
          {members.length > 0 ? (
            members.map((i) => (
              <UserItem key={i.id} user={i} handler={selectMemberHandler} 
              isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>Cancel</Button>
          <Button onClick={addMemberSubmitHandler} 
          variant="contained" disabled={isLoadingAddMember}>
            Submit changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
