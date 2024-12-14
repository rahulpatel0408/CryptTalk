import React, { useState } from "react";
import "./Login.css";
import passwd_icon from "./../assets/LoginSignup/psswd.svg";
import user_icon from "./../assets/LoginSignup/user.svg";
import logo from "./../assets/LoginSignup/logo.png";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { server } from "../components/constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [privacy, setPrivacy] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const dispatch = useDispatch();

  const handleButtonClick = async (e) => {
    e.preventDefault();

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username,
          password: password,
        },
        config
      );
      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
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
          <div className="text">Login</div>
          <div className="underline"></div>
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
              <div className="forgot">
                <NavLink to="/reset">Forgot password?</NavLink>
              </div>
            </div>
          </div>
          <div className="submit-container">
            <button className="submit" onClick={handleButtonClick}>
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="signup">
        Don't have an account?
        <strong>
          <NavLink to="/register"> Register Now</NavLink>
        </strong>
      </div>
    </>
  );
};

export default Login;
