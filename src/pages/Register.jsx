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
import axios from "axios";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../components/constants/config";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [privacy, setPrivacy] = useState(true);

  const avatar = useFileHandler("single");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const dispatch = useDispatch();

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name);
    formData.append("bio",bio);
    formData.append("username", username);
    formData.append("password", password);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(true));
      toast.success(data.message)
    } catch (error) {
      console.log(avatar.file)
      // console.log("FormData:", Object.fromEntries(formData.entries()));
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
   
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
                placeholder="Name"
                onChange={handleNameChange}
              />
              <img src={user_icon} alt="" />
            </div>
            <div className="input">
              <input
                type="text"
                placeholder="Bio"
                onChange={handleBioChange}
              />
              <img src={email_icon} alt="" />
            </div>
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
                type={privacy ? "password" : "text"}
                placeholder="password"
                onChange={handlePasswordChange}
              />
              <img
                src={passwd_icon}
                alt="Toggle visibility"
                onClick={() => setPrivacy(!privacy)}
                style={{ cursor: "pointer" }}
              />
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
