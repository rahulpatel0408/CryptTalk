import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import ProtectRoute from "./components/auth/ProtectRoute";
import NotFound from "./pages/NotFound";
import Profile from "./components/specific/Profile";
import axios from "axios";
import { server } from "./components/constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Protected Routes */}
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Register />
              </ProtectRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
