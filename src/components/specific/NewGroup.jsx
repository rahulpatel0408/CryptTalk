import { useInputValidation } from '6pp';
import { Button, Box, MenuItem, Divider, Stack, Dialog, DialogTitle, TextField, Typography, Avatar, Grid2 } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../constants/SampleData';

const NewGroup = ({ handleCloseNewGroup }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    const selectMemberHandler = ({ _id }) => {
        setSelectedMembers((prev) =>
            prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
        );
    };


    const submitHandler = () =>{
        console.log(selectedMembers, groupName)
    }
    
    const [groupName, setGroupName] = useState('');
    const groupNameChange=(e)=>{
        setGroupName(e.target.value)
    }

    return (
        <Dialog
            open
            onClose={handleCloseNewGroup}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                    width:"auto",
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
            }}
        >
            <Stack
            sx={{
                width: 'auto',
            }}>
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: 'white',
                }}>
                    <DialogTitle textAlign={"center"}>
                        <strong>New Group</strong>
                    </DialogTitle>
                    <TextField
                    onChange={groupNameChange}
                        placeholder='Group Name'
                        sx={{

                            margin: '10px',
                            marginTop: "0px",
                            marginBottom: "20px",
                            '& .MuiInputBase-input': {
                                height: "8px",
                                display: "flex",

                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    />
                    <Typography align='center'>Add Members</Typography>
                    <Divider variant="middle" sx={{ borderWidth: '1.5px', marginBottom: '5px', borderColor: '#555' }} />
                </Box>
                <Grid2
                    sx={{
                        alignItems: 'center',
                    justifyContent: 'center',
                    }}
                    container spacing={1}
                    columnSpacing={{
                        xs: 1

                    }}>
                    {sampleUsers.length > 0 ? (
                        sampleUsers.map(({ avatar, name, _id }) => (
                            <Grid2  xs={6} key={_id}>
                                <GroupItem
                                    avatar={avatar}
                                    _id={_id}
                                    name={name}
                                    handler={selectMemberHandler}
                                    isUserSelected={selectedMembers.includes(_id)}
                                />
                            </Grid2>
                        ))
                    ) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )}
                </Grid2>

                <Box sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    backgroundColor: 'white',
                    padding: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                }}>
                    <Button sx={{

                    }} variant="contained" onClick={submitHandler}>Create</Button>
                </Box>

            </Stack>
        </Dialog>
    );
};

const GroupItem = ({ avatar, name, _id, handler, isUserSelected }) => {
    return (
        <MenuItem
            onClick={() => handler({ _id })}
            disableRipple
            sx={{
                width:'250px',
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                cursor: "pointer",
                justifyContent: 'space-between',
                padding: '10px',
                borderRadius: '10px',
                bgcolor: isUserSelected ? '#00c200' : '#ffffff',
                ":hover": {
                    bgcolor: isUserSelected ? '#009900' : '#f0f0f0',
                    transition: 'background-color 0.3s ease',
                    transform: 'scale(1.05)'

                },
                marginX: '15px',

                borderRadius: '10px',
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar alt="user profile" src={avatar} sx={{ width: 40, height: 40 }} />
                <Typography>{name}</Typography>
            </Stack>


        </MenuItem>
    );
};

export default NewGroup;
