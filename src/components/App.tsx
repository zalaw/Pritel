import React from "react";
import { ToastContainer } from "react-toastify";
import Signin from "../pages/Signin";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import PrivateRoute from "./PrivateRoute";
import { Home } from "../pages/Home";

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

      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="tasks" element={"/tasks"}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
