import React, { useState } from "react";
import "./Register.css";
import { useFileHandler } from "6pp";
import passwd_icon from "./../assets/LoginSignup/psswd.svg";
import user_icon from "./../assets/LoginSignup/user.svg";
import logo from "./../assets/LoginSignup/logo.png";
import email_icon from "./../assets/LoginSignup/email.svg";
import { NavLink } from "react-router-dom";
import { Avatar, IconButton, Stack } from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const avatar = useFileHandler("single");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setEmail(e.target.value);
  };
  const handleEmailChange = (e) => {
    setPassword(e.target.value);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="header1">
        <img src={logo} alt="" />
      </div>
      <div className="container">
        <div className="header">
          <div className="text">Register</div>
          <div className="underline"></div>
          <Stack position={"relative"} width={"10rem"} margin={"auto"}>
            <Avatar
              sx={{
                width: "10rem",
                height: "10rem",
                objectFit: "contain",
              }}
              src={avatar.preview}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: "0",
                right: "0",
                bgColor: "rgba(0,0,0,0.5)",
                ":hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
              }}
              component="label"
            >
              <>
                <CameraAltIcon />
                <VisuallyHiddenInput
                  type="file"
                  onChange={avatar.changeHandler}
                />
              </>
            </IconButton>
          </Stack>
          <div className="inputs">
            <div className="input">
              <input
                type="text"
                placeholder="Username"
                onChange={handleUsernameChange}
              />
              <img src={user_icon} alt="" />
            </div>
            <div className="input">
              <input
                type="text"
                placeholder="Email"
                onChange={handleEmailChange}
              />
              <img src={email_icon} alt="" />
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
              <img src={passwd_icon} alt="" />
            </div>
          </div>
          <div className="submit-container">
            <button className="submit" onClick={handleButtonClick}>
              Register
            </button>
          </div>
        </div>
      </div>
      <div className="signup">
        Already have an account?
        <strong>
          <NavLink to="/login"> Login Now</NavLink>
        </strong>
      </div>
    </>
  );
};

export default Register;
