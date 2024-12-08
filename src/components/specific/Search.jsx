import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Box
} from "@mui/material";
import React, { useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../constants/SampleData2";

const Search = ({handler}) => {
  const search = useInputValidation("");

  let isLoadingSendFriendRequest=false;
  const [users, setUsers] = useState(sampleUsers)

  const addFriendHandler = (id) =>{
    //baad mein karunga
  }
  return (
    <Dialog open onClose={handler}
    sx={{
        '& .MuiPaper-root': {
            borderRadius: '20px',
            width:"auto",
            maxHeight:'60%',
            
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    }}>
        
      <Stack p={"2rem"} direction={"column"} width={"25rem"}sx={{
        paddingTop:"0px"
      }}>
        <Box 
        sx={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'white',
            flexDirection: "column",
        }}>
        <Box>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        </Box>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        </Box>
        <Box>
        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default Search;
