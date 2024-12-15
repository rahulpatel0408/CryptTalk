import {
  Divider,
  AppBar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { lazy, Suspense, useState } from "react";
import logo_icon from "./../../assets/LoginSignup/logo.png";
import {
  NotificationsActiveRounded as NotificationsActiveRoundedIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
  GroupAdd as GroupAddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  GroupAdd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Notifications from "../specific/Notifications";
import NewGroup from "../specific/NewGroup";
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { setIsMobile, setIsSearch } from "../../redux/reducers/misc";
const Search = lazy(() => import("../specific/Search"));
const Header = () => {
  const { user } = useSelector((state) => state.auth);
  
  const userName = user?.name; 
  const pathToProfilePicture = user?.avatar?.url; 
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isNewGroup, setIsNewGroup] = useState(false);
  const {isSearch} = useSelector(state=>state.misc)
  
  const navigateToGroup = () => navigate("/groups");
  const navigatetoHome = () => navigate("/");

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearchDailog = () => {
    dispatch(setIsSearch(true));
  };
  const openNewGroup = () => {
    setIsNewGroup(true);
  };
  const closeNewGroup = () => {
    setIsNewGroup(false);
  };

  const [anchorElNotification, setAnchorElNotification] = useState(null);

  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorElNotification(null);
  };
  //profile button
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogoutClick = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
    handleMenuClose();
  };

  const handleSettingClick = () => {
    //later
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          display: "flex",
          bgcolor: "#FFFFFF",
          // height:"70px",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Toolbar disableGutters>
          <Avatar
            alt="logo"
            src={logo_icon}
            onClick={navigatetoHome}
            sx={{
              cursor: "pointer",
              marginLeft: "10px",
              marginTop: "15px",
              width: "150px",
              height: "50px",
              variant: "square",
              display: { xs: "none", sm: "block" },
            }}
          />

          <Box
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <IconButton color="#0c6ba1" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconBtn
              title={"Search"}
              icon={<SearchIcon />}
              onClick={openSearchDailog}
            />
            <IconBtn
              title={"Add Group"}
              icon={<GroupAddIcon />}
              onClick={openNewGroup}
            />
            <IconBtn
              title={"Manage Group"}
              icon={<GroupIcon />}
              onClick={navigateToGroup}
            />
            <IconBtn
              title={"Notification"}
              icon={<NotificationsActiveRoundedIcon />}
              onClick={handleNotificationMenuOpen}
            />
            <IconBtn
              title={"Profile"}
              icon={<Avatar alt="user Profile" src={pathToProfilePicture} />}
              onClick={handleMenuOpen}
            />

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
            {isNewGroup && <NewGroup handleCloseNewGroup={closeNewGroup} />}
          </Box>
        </Toolbar>
      </AppBar>
      {isSearch && (
        <Suspense fallback={<div>loading.....</div>}>
          <Search handler={openSearchDailog} />
        </Suspense>
      )}
    </Box>
  );
};

const MenuRight = ({
  anchorEl,
  handleMenuClose,
  handleProfileClick,
  handleSettingClick,
  handleLogoutClick,
  userName,
  pathToProfilePicture,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "20px",
          width: "250px",
          padding: "10px 0",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <Avatar
          alt="User Profile"
          src={pathToProfilePicture}
          sx={{
            width: 100,
            height: 100,
            marginBottom: "10px",
            border: "2px solid #000000",
          }}
        />

        <Typography
          sx={{
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <strong>{userName}</strong>
        </Typography>

        <Divider
          sx={{
            width: "80%",
            margin: "10px 0",
            borderWidth: "1.5px",
            borderColor: "#555",
          }}
        />
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
        width: "100%",
        padding: "10px 20px",
        fontSize: "15px",
        fontWeight: 550,
        color: "#555",
        "&:hover": {
          backgroundColor: "#f0f4ff",
          color: "#1976d2",
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
      <IconButton
        sx={{
          paddingLeft: "25px",
          paddingRight: "25px",
        }}
        color="#000000"
        size="large"
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
