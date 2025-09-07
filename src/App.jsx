import React from "react";
import { Route, Routes } from "react-router-dom";
import 'rsuite/dist/rsuite-no-reset.min.css';
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./account/Dashboard";
import { UserProvider } from "./assets/context-api/user-context/UserProvider";
import PrivateRoutes from "./assets/components/PrivateRoutes";

function App() {

  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/account/dashboard" element={<Dashboard />} /> 
        </Route>
      </Routes>
     </UserProvider>
    </>
  )
}

export default App
