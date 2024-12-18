import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
        height="100%"
      >
        <ErrorIcon sx={{ fontSize: "10rem" , bgcolor:"black"}}/>
        <Typography variant="h1" color="black">404</Typography>
        <Typography variant="h3" color="black">Not Found</Typography>
        <Link to="/">Go back to home</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
