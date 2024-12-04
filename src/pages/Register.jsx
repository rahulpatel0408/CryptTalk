import React,{useState} from 'react'
import './Register.css'
import passwd_icon from './../assets/LoginSignup/psswd.svg'
import user_icon from './../assets/LoginSignup/user.svg'
import logo from './../assets/LoginSignup/logo.png'
import email_icon from './../assets/LoginSignup/email.svg'


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleUsernameChange = (e)=>{
    setUsername(e.target.value);
  }
  const handlePasswordChange = (e)=>{
    setEmail(e.target.value);
  }
  const handleEmailChange = (e)=>{
    setPassword(e.target.value);
  }

  const handleButtonClick = ()=>{ //edit later
    console.log(username,email,password);

  }
 

  return (
    <>
    <div className="header1">
      <img src ={logo} alt="" />
    </div>
    <div className="container">
      <div className="header">
        <div className="text">Register</div>
        <div className="underline"></div>
        <div className="inputs">
          <div className="input">
            <input type="text" placeholder="Username" onChange={handleUsernameChange}/>
            <img src={user_icon} alt=""/>
          </div>
          <div className="input">
            <input type="text" placeholder="Email" onChange={handleEmailChange}/>
            <img src={email_icon} alt=""/>
          </div>
          <div className="input">
            <input type="password" placeholder="Password" onChange={handlePasswordChange}/>
            <img src={passwd_icon} alt="" />
          </div>
        </div>
        <div className="submit-container">
          <button className="submit" onClick={handleButtonClick}>Register</button>
        </div>
      </div>
    </div>
    <div className="signup">Already have an account?<strong><a href="/login"> Login Now</a></strong></div>
    </>


  )
}




export default Register