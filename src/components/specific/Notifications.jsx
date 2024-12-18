import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { useErrors } from "../../hooks/hooks";
import toast from "react-hot-toast";

const Notifications = ({
  anchorElNotification,
  handleNotificationMenuClose,
}) => {
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation();

  const [notifications, setNotifications] = useState([]);

  useErrors([{ error, isError }]);

  useEffect(() => {
    if (data?.allRequests) {
      setNotifications(data.allRequests);
    }
  }, [data]);

  const friendRequestHandler = async ({ _id, accept }) => {
    
    try {
      console.log(_id);
      const res = await acceptRequest({ requestId: _id, accept });
      if (res.data?.success) {
        toast.success(res.data.message);
        setNotifications((prev) => prev.filter((notif) => notif._id !== _id));
      } else {
        console.log(res.data);
        toast.error(res.data?.error || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
      console.log(error.message);
    }
  };

  return (
    <Menu
      anchorEl={anchorElNotification}
      open={Boolean(anchorElNotification)}
      onClose={handleNotificationMenuClose}
      sx={{
        display: "flex",
        marginTop: "8px",
        //to hide scrollbar
        "& .MuiPaper-root": {
          borderRadius: "20px",
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },

        maxHeight: "500px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography textAlign={"centre"}>
          <strong>Notifications</strong>
        </Typography>

        {isLoading ? (
          <Skeleton>Loading...</Skeleton>
        ) : notifications.length > 0 ? (
          notifications.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id}
            />
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              paddingX: "20px",
              paddingY: "30px",
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
              }}
              textAlign={"centre"}
            >
              0 Notifications
            </Typography>
          </Box>
        )}
      </Box>
    </Menu>
  );
};

const NotificationItem = ({ sender, _id,  handler }) => {
  const { avatar, name } = sender;

  return (
    <MenuItem
      disableRipple
      sx={{
        display: "flex",
        marginTop: "10px",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt="user profile" src={avatar} />
        <Box>
          <Typography>{name} sent you a friend request</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2196f3  ",
                color: "#ffffff ",
                "&:hover": {
                  backgroundColor: "#1976d2   ",
                },
              }}
              onClick={() => handler({ _id, accept: true })}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#ff5323 ",
                color: "#ffffff ",
                "&:hover": {
                  backgroundColor: "#d32f2f ",
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

export default Notifications;
