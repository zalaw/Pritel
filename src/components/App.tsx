import React from "react";
import { ToastContainer } from "react-toastify";
import Signin from "../pages/Signin";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import PrivateRoute from "./PrivateRoute";
import { Home } from "../pages/Home";
import Enroll from "../pages/Enroll";
import { Handle } from "../pages/Handle";
import { NotFound } from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";

import NavbarLayout from "./NavbarLayout";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import { Unauthorized } from "../pages/Unauthorized";
import Tasks from "../pages/Tasks";
import Task from "../pages/Task";
import Rewards from "../pages/Rewards";
import Badges from "../pages/Badges";

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

      {/* <Navbar /> */}

      <div className="main-container">
        <Routes>
          <Route path="/" element={<NavbarLayout />}>
            <Route index element={<Home />}></Route>
            <Route path="/handle" element={<Handle />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/enroll" element={<Enroll />}></Route>
            <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
            <Route path="/unauthorized" element={<Unauthorized />}></Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route element={<PrivateRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />}></Route>
              </Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/tasks" element={<Tasks />}></Route>
              <Route path="/tasks/:id" element={<Task />}></Route>
              <Route path="/rewards" element={<Rewards />}></Route>
              <Route path="/badges" element={<Badges />}></Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
