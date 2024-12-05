import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy } from "react";
import "./App.css";


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProtectRoute = lazy(() => import("./components/auth/ProtectRoute"));

let user = false;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route element={<ProtectRoute user={user} />} >
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={
            <ProtectRoute user={!user} redirect="/" children={<Login />} />
          } />
          <Route path="/register" element={
            <ProtectRoute user={!user} redirect="/" children={<Register />} />
          } />
          <Route path="*" element={<Home />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
