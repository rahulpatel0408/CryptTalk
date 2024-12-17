import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Menu,
  Drawer,
  Tooltip,
  Typography,
  Stack,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupList from "../components/specific/GroupList";
import { sampleChats } from "../components/constants/SampleData2";
import { sampleUsers } from "../components/constants/SampleData";
import UserItem from "../components/shared/UserItem";
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { LayoutLoader } from "../components/layout/Loaders";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dailogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
  import("../components/dailogs/AddMemberDialog")
);


const Groups = () => {
  const chatId = useSearchParams()[0].get("group");

  const {isAddMember} = useSelector(state=>state.misc)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateBack = () => {
    navigate("/");
  };
  
  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery({chatId, populate:true},{skip:!chatId});
  // console.log(groupDetails)
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [members, setMembers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);0
    updateGroup("Updating Group Name...", {chatId, name:groupNameUpdatedValue});
    
      setGroupName(groupNameUpdatedValue); 
      myGroups.refetch();
    
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);

  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    console.log('awdwad', chatId)
    deleteGroup("Deleting Group...", chatId)
    closeConfirmDeleteHandler();
    navigate("/groups");
  }

  const removeMemberHandler = (id) => { 
    console.log({chatId, userId:id})
    removeMember("Removing  Member...", {chatId, userId:id});
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const errors =[{
    isError: myGroups.isError,
    error: myGroups.error,
  },
  {
    isError: myGroups.isError,
    error: myGroups.error,
  }

]
  useErrors(errors);
  // console.log(groupName);
 useEffect(()=>{
  if(groupDetails.data){
    setGroupName(groupDetails.data.chat.name);
    setGroupNameUpdatedValue(groupDetails.data.chat.name);
    setMembers(groupDetails.data.chat.members);
  }
  return()=>{
    setGroupName("");
    setGroupNameUpdatedValue("");
    setMembers([]);
    setIsEdit(false)
  }
 },[groupDetails.data]);

  const IconBtns = (
    <>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "0.8rem",
            right: "1.5rem",
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          onClick={handleMobile}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          sx={{
            position: "absolute",
            top: "0.8rem",
            left: "1.5rem",
            bgcolor: "#666666",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#444444",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4" color="black">
            {groupName}
          </Typography>
          <IconButton disabled={isLoadingGroupName} onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
      sx={{
        display:"flex",
        justifyContent:"center",
      }}
    >
      <Button
        sx={{
          display: "flex",
        }}
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        sx={{
          display: "flex",
        }}
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        {" "}
        Add member
      </Button>
    </Stack>
  );

  return ( myGroups.isLoading?<LayoutLoader/>:
    <Grid container height={"100vh"}>
      <Grid
        item
        height={"100vh"}
        sx={{
          backgroundColor: "#ffffff",
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={3}
      >
        <Typography
          color="black"
          sx={{
            padding: "15px",
          }}
        >
          My Groups
        </Typography>
        <Divider variant="middle" flexItem></Divider>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Divider orientation="vertical"></Divider>
      <Grid
        item
        sx={{
          flexGrow: 1,
          backgroundColor: "#ffffff",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
          display:"flex"
        }}
      >
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              // alignSelf={"flex-start"}
              variant="body1"
              color={"#000000"}
              sx={{
                dispay:'flex',
                alignItems:"center",
                justifyContent:'center'
              }}
            >
              <strong>Members</strong>
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              bgcolor={"#ffffff"}
              color={'black'}
              overflow={"auto"}
              sx={{
                display:"flex",
                alignItems:"center",
                // justifyContent:"center",
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    }
                },
              }}
            >
              { isLoadingRemoveMember?<CircularProgress/>:
                members.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem"
                    }}
                    handler={removeMemberHandler}
                    isAdded={true}

                  />
                ))
              }
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {
        isAddMember && (
          <Suspense fallback={<div>Loading.....</div>}>
            <AddMemberDialog chatId={chatId}/>
          </Suspense>
        )
      }

      {confirmDeleteDialog && (
        <Suspense fallback={<div>Loading.....</div>}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          xs: "block",
          sm: "none",
          display: "flex",
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Typography
          color="black"
          sx={{
            display: "flex",
            padding: "15px",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
          }}
        >
          My Groups
        </Typography>
        <Divider variant="middle" flexItem></Divider>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

export default Groups;
