import React,{useState} from 'react'
import './Login.css'
import passwd_icon from './../assets/LoginSignup/psswd.svg'
import user_icon from './../assets/LoginSignup/user.svg'
import logo from './../assets/LoginSignup/logo.png'


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e)=>{
    setUsername(e.target.value);
  }
  const handlePasswordChange = (e)=>{
    setPassword(e.target.value);
  }

  const handleButtonClick = ()=>{ //edit later
    console.log(username,password);

  }
 

  return (
    <>
    <div className="header1">
      <img src ={logo} alt="" />
    </div>
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
        <div className="inputs">
          <div className="input">
            <input type="text" placeholder="Username" onChange={handleUsernameChange}/>
            <img src={user_icon} alt=""/>
          </div>
          <div className="input">
            <input type="password" placeholder="Password" onChange={handlePasswordChange}/>
            <img src={passwd_icon} alt="" />
            <div className="forgot"><a href="/reset">Forgot password?</a></div>
          </div>
        </div>
        <div className="submit-container">
          <button className="submit" onClick={handleButtonClick}>Login</button>
        </div>
      </div>
    </div>
    <div className="signup">Don't have a account?<strong><a href="/register"> Register Now</a></strong></div>
    </>


  )
}




export default Login