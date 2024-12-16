import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hooks";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const search = useInputValidation("");
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] =  useAsyncMutation(useSendFriendRequestMutation);
  
  const {isSearch} = useSelector(state=>state.misc)
  const closeSearchDailog = () => {
      dispatch(setIsSearch(false));
    };
  
  const [users, setUsers] = useState([])

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };
  
  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      if(search.value){
        searchUser(search.value)
        .then(({data})=>setUsers(data.users))
        .catch((e)=>console.log(e));
      }
    },1000);

    return ()=>{
      clearTimeout(timeOutId);
    };
  },[search.value]);

  return (
    <Dialog open={isSearch} onClose={closeSearchDailog}
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
          {
          users.length == 0
          ?
          (<Typography sx={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            color: "gray",
            marginTop:"20px"
          }}> no such user</Typography>)
          :
          users.map((i) => (
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
