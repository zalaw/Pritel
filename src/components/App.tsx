import React from "react";
import { ToastContainer } from "react-toastify";
import Signin from "../pages/Signin";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./PrivateRoute";
import { Home } from "../pages/Home";
import Enroll from "../pages/Enroll";
import { Handle } from "../pages/Handle";
import { NotFound } from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import { Unauthorized } from "../pages/Unauthorized";
import Tasks from "../pages/Tasks";
import Task from "../pages/Task";
import Rewards from "../pages/Rewards";
import Badges from "../pages/Badges";
import PublicLayout from "../layouts/PublicLayout";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />

      <div className="main-container">
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />}></Route>
            <Route path="/handle" element={<Handle />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/enroll" element={<Enroll />}></Route>
            <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
            <Route path="/unauthorized" element={<Unauthorized />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>

          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
            <Route path="/statistics" element={"/statistics"}></Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/tasks" element={<Tasks />}></Route>
            <Route path="/tasks/:id" element={<Task />}></Route>
            <Route path="/rewards" element={<Rewards />}></Route>
            <Route path="/badges" element={<Badges />}></Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
