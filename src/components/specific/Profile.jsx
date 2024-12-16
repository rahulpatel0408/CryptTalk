import { Avatar, Stack, Typography, Box } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameICon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";
import { tranformImage } from "../../lib/features";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          paddingY: "80px",
          paddingX: "80px",
          display: "flex",
          backgroundColor: "#f0f0f0",
          borderRadius: "25px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          spacing={"2rem"}
          direction={"column"}
          alignItems={"center"}
        >
          <Avatar
            src={tranformImage(user?.avatar?.url)}
            sx={{
              width: 200,
              height: 200,
              objectFit: "contain",
              marginBottom: "1rem",
              border: "5px solid green",
            }}
          />
          <ProfileCard heading={"Bio"} text={user?.bio} />
          <ProfileCard
            heading={"Username"}
            text={user?.username}
            Icon={
              <UserNameICon
                sx={{
                  color: "black",
                }}
              />
            }
          />
          <ProfileCard
            heading={"Name"}
            text={user?.name}
            Icon={
              <FaceIcon
                sx={{
                  color: "black",
                }}
              />
            }
          />
          <ProfileCard
            heading={"Joined"}
            text={moment(user?.createdAt).fromNow()}
            Icon={
              <CalendarIcon
                sx={{
                  color: "black",
                }}
              />
            }
          />
        </Stack>
      </Box>
    </Box>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1" color="black">
        {text}
      </Typography>
      <Typography variant="caption" color="gray">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
