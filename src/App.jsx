import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy } from "react";
import "./App.css";
import ProtectRoute from "./components/auth/ProtectRoute";
import NotFound from "./pages/NotFound";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

let user = true;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route path="*" element={<NotFound />}/>
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
