import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Typography } from "@mui/material";

const Home = () => {
  return (
    <Typography p={"2rem"} variant="h5" textAlign={"center"} 
    sx={{
      color:"rgba(0,0,0,0.8)",
    }}>
      Select a friend to chat
    </Typography>
  );
};

export default AppLayout()(Home);
