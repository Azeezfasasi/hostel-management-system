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
import ScrollToTop from "./assets/components/ScrollToTop";
import HostelList from "./account/HostelList";
import RoomList from "./account/RoomList";
import RoomAllocation from "./account/RoomAllocation";
import AssignRooms from "./account/AssignRooms";
import CurrentAllocationsMain from "./assets/components/hostel-components/CurrentAllocationsMain";
import CurrentRoomAllocation from "./account/CurrentRoomAllocation";
import AllFurnitures from "./account/AllFurnitures";
import AddFurnitures from "./account/AddFurniture";
import AddFurnitureCategory from "./account/AddFurnitureCategory";
import DamageReportForm from "./account/DamageReportForm";
import RoomRequest from "./account/RoomRequests";
import AdminRoomRequests from "./account/AdminRoomRequest";
import ManageStutents from "./account/ManageStutents";
import MyRoomDetails from "./account/MyRoomDetails";

function App() {

  return (
    <>
    <UserProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/account/dashboard" element={<Dashboard />} /> 
          <Route path="/account/hostellist" element={<HostelList />} />
          <Route path="/account/roomlist" element={<RoomList />} />
          <Route path="/account/roomallocation" element={<RoomAllocation />} />
          <Route path="/account/assignrooms" element={<AssignRooms />} />
          <Route path="/account/currentroomallocation" element={<CurrentRoomAllocation />} />
          <Route path="/account/allfurnitures" element={<AllFurnitures />} />
          <Route path="/account/addfurnitures" element={<AddFurnitures />} />
          <Route path="/account/addfurniturecategory" element={<AddFurnitureCategory />} />
          <Route path="/account/damagereportform" element={<DamageReportForm />} />
          <Route path="/account/roomrequest" element={<RoomRequest />} />
          <Route path="/account/adminroomrequests" element={<AdminRoomRequests />} />
          <Route path="/account/managestudents" element={<ManageStutents />} />
          <Route path="/account/myroomdetails" element={<MyRoomDetails />} />
        </Route>
      </Routes>
     </UserProvider>
    </>
  )
}

export default App
