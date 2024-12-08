import { Divider, AppBar, Box, Toolbar, Menu, MenuItem, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import React, { Suspense, useState } from 'react';
import logo_icon from "./../../assets/LoginSignup/logo.png"
import { NotificationsActiveRounded as NotificationsActiveRoundedIcon , Logout as LogoutIcon, Group as GroupIcon, GroupAdd as GroupAddIcon, Menu as MenuIcon, Search as SearchIcon, GroupAdd } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import Notifications from '../specific/Notifications';
import NewGroup from '../specific/NewGroup';

const Header = () => {
  const userName = 'name' //
  const pathToProfilePicture = '' //baad mai karunga
  
  const [isNewGroup, setIsNewGroup] = useState(false);
  const navigate = useNavigate();

  const navigateToGroup = () => navigate("/group")

  const handleMobile = () => {
    // for later
  }
  const openSearchDailog = () => {
    // for later
  }
  const openNewGroup = () => {
    setIsNewGroup(true);
    
  }
  const closeNewGroup = () => {
    setIsNewGroup(false);
    
  }

  const [anchorElNotification, setAnchorElNotification] = useState(null);

  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
  }

  const handleNotificationMenuClose = () => {
    setAnchorElNotification(null);

  }
  //profile button 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleProfileClick = () => {
    navigate('/profile')
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    //later
    handleMenuClose();
  };

  const handleSettingClick = () => {
    //later
    handleMenuClose();
  };


  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#FFFFFF",
          // height:"70px",
          borderRadius: "0 0 15px 15px",

        }}
      >
        <Toolbar disableGutters>
          <Avatar
            alt="logo"
            src={logo_icon}
            sx={{ marginLeft: "10px", marginTop: "15px", width: "150px", height: "50px", variant: "square", display: { xs: "none", sm: "block" } }}
          />

          <Box sx={{
            display: { xs: "block", sm: "none" },
          }}>
            <IconButton color="#0c6ba1" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
  
          <Box sx={{ flexGrow: 1 }} />
          <Box>

            <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearchDailog} />
            <IconBtn title={"Add Group"} icon={<GroupAddIcon />} onClick={openNewGroup} />
            <IconBtn title={"Manage Group"} icon={<GroupIcon />} onClick={navigateToGroup} />
            <IconBtn title={"Notification"} icon={<NotificationsActiveRoundedIcon />} onClick={handleNotificationMenuOpen} />
            <IconBtn title={"Profile"} icon={
              <Avatar
                alt="user Profile"
                src={pathToProfilePicture}
              />} onClick={handleMenuOpen} />

            <MenuRight
              anchorEl={anchorEl}
              handleMenuClose={handleMenuClose}
              handleProfileClick={handleProfileClick}
              handleSettingClick={handleSettingClick}
              handleLogoutClick={handleLogoutClick}
              userName={userName}
              pathToProfilePicture={pathToProfilePicture}
            />
            <Notifications
              anchorElNotification={anchorElNotification}
              handleNotificationMenuClose={handleNotificationMenuClose}
              
            />
            {
              isNewGroup&&(
                <NewGroup handleCloseNewGroup={closeNewGroup}/>
              )
            }

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  );
};


const MenuRight = ({ 
  anchorEl,
  handleMenuClose, 
  handleProfileClick, 
  handleSettingClick, 
  handleLogoutClick, 
  userName, 
  pathToProfilePicture 
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '20px',
          width: '250px',
          padding: '10px 0',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
        
        <Avatar
          alt="User Profile"
          src={pathToProfilePicture}
          sx={{
            width: 100,
            height: 100,
            marginBottom: '10px',
            border: '2px solid #000000',
          }}
        />

        <Typography
          sx={{
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
         <strong>{userName}</strong>
        </Typography>

        <Divider sx={{ width: '80%', margin: '10px 0', borderWidth:'1.5px',borderColor: '#555', }} />
        <MenuItemCustom label="Profile" onClick={handleProfileClick} />
        <MenuItemCustom label="Settings" onClick={handleSettingClick} />
        <MenuItemCustom label="Logout" onClick={handleLogoutClick} />
      </Box>
    </Menu>
  );
};


const MenuItemCustom = ({ label, onClick }) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        width: '100%',
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 550,
        color: '#555',
        '&:hover': {
          backgroundColor: '#f0f4ff',
          color: '#1976d2',
        },
      }}
    >
      {label}
    </MenuItem>
  );
};


const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton sx={{
        paddingLeft: "25px",
        paddingRight: "25px",
      }} color='#000000' size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>

  );
}

export default Header;
