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
import { Navbar } from "./Navbar";

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

      <Navbar />

      <div className="main-container">
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/handle" element={<Handle />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/enroll" element={<Enroll />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>

          <Route path="/" element={<Layout />}>
            <Route path="/das" element={<PrivateRoute />}>
              <Route path="dashboard" element={"/tasks"}></Route>
              <Route path="tasks" element={"/tasks"}></Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
