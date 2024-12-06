import { Avatar, Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { sampleNotifications } from '../constants/SampleData';

const Notifications = ({
    anchorElNotification,
    handleNotificationMenuClose,
}) => {

    const friendRequestHandler = ({ _id, accept }) => {
        console.log(_id, accept);
    }

    return (
        <Menu
            anchorEl={anchorElNotification}
            open={Boolean(anchorElNotification)}
            onClose={handleNotificationMenuClose}
            sx={{
                display: "flex",
                marginTop: '8px',
                //to hide scrollbar
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    }
                },

                maxHeight: '500px',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
            }}>
                <Typography textAlign={"centre"}><strong>Notifications</strong></Typography>

                {
                    sampleNotifications.length > 0 ? (

                        sampleNotifications.map(({ sender, _id }) => (
                            <NotificationItem
                                sender={sender}
                                _id={_id}
                                handler={friendRequestHandler}
                                key={_id}
                            />
                        ))
                    ) : (
                        <Typography textAlign={"centre"}>No Notifications</Typography>
                    )
                }

            </Box>
        </Menu>
    );
};

const NotificationItem = ({ sender, _id, handler }) => {
    const { avatar, name } = sender;

    return (
        <MenuItem disableRipple sx={{
            display: 'flex',
            marginTop: '10px',
        }}>

            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar alt="user profile" src={avatar} />
                <Box>
                    <Typography>{name} sent you a friend request</Typography>
                    <Box sx={{ 
                        display: 'flex', gap: 1 
                        }}>
                        <Button 
                        variant="contained" 
                        size="small" 
                        sx={{
                            backgroundColor: '#2196f3  ', 
                            color: '#ffffff ',           
                            '&:hover': {
                              backgroundColor: '#1976d2   ', 
                            },
                          }}
                        onClick={() => handler({ _id, accept: true })
                        }>
                        Accept
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: '#ff5323 ', 
                                color: '#ffffff ',           
                                '&:hover': {
                                  backgroundColor: '#d32f2f ', 
                                },
                              }}
                            onClick={() => handler({ _id, accept: false })}
                        >
                            Reject
                        </Button>
                    </Box>
                </Box>
            </Stack>
        </MenuItem>
    );
};



export default Notifications
