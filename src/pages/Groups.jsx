import React, { useState } from 'react'
import { Grid, IconButton, Menu,Drawer, Tooltip, Typography, Stack, Divider } from '@mui/material'
import { Menu as MenuIcon, KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import GroupList from '../components/specific/GroupList'
import { sampleChats } from '../components/constants/SampleData2'

const Groups = () => {
    
    const chatId = useSearchParams()[0].get("group");

    const navigate = useNavigate();
    const navigateBack = () => {
        navigate("/");
    };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => (!prev));
    }
    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };
    const IconBtns = (
        <>
            <Tooltip title="Back">

                <IconButton sx={{
                    position: "absolute",
                    top: "0.8rem",
                    right: "1.5rem",
                    display: {
                        xs: "block",
                        sm: "none"
                    }
                }}
                onClick={handleMobile}>
                    <MenuIcon />
                </IconButton>

                <IconButton sx={{
                    position: "absolute",
                    top: "0.8rem",
                    left: "1.5rem",
                    bgcolor: "#666666",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#444444",
                    }
                }}
                    onClick={navigateBack}>
                    <KeyboardBackspaceIcon />
                </IconButton>
            </Tooltip>
        </>
    );

    return (
        <Grid container height={"100vh"}>
            <Grid
                item
                height={"100vh"}
                sx={{
                    backgroundColor: "#ffffff",
                    display: {
                        xs: "none",
                        sm: "block"
                    }
                }}
                sm={3}>
                <Typography color='black' sx={{
                    padding:"15px"
                }}>My Groups</Typography>
                <Divider variant="middle" flexItem></Divider>
                <GroupList myGroups={sampleChats} chatId={chatId} />
            </Grid>
            <Divider orientation='vertical'></Divider>
            <Grid
                item
                sx={{
                    flexGrow:1,
                    backgroundColor: "#ffffff",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem",
                }}>
                {
                    IconBtns
                }
            </Grid>
            <Drawer
                sx={{
                    xs: "block",
                    sm: "none",
                    display:"flex",
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}>
                <Typography color='black' sx={{
                    display:'flex',
                    padding:"15px",
                    alignItems:"center",
                    justifyContent:"center",
                    width:"200px"
                }}>My Groups</Typography>
                <Divider variant="middle" flexItem></Divider>
                <GroupList myGroups={sampleChats} chatId={chatId} />
            </Drawer>

        </Grid>
    )
}



export default Groups