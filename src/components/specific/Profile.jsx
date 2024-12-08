import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameICon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid green",
        }}
      />
      <ProfileCard heading={"Bio"} text={"something is better than nothing"} />
      <ProfileCard
        heading={"Username"}
        text={"Extreme_Substance"}
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
        text={"Rahul prasad patel"}
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
        text={moment('2024-12-07T18:30:00.000Z').fromNow()}
        Icon={
          <CalendarIcon
            sx={{
              color: "black",
            }}
          />
        }
      />
    </Stack>
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
