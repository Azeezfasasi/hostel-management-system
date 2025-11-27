import React from "react";
import './App.css';
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
import Onboarding from "./onboarding/Onboarding";
import ManageUsers from "./account/ManageUsers";
import AddNewUser from "./account/AddNewUser";
import ChangeUserPassword from "./account/ChangeUserPassword";
import SendNewsletter from "./account/SendNewsletter";
import NewsletterSubscribers from "./account/NewsletterSubscribers";
import AllNewsletter from "./account/AllNewsletter";
import Profile from "./account/Profile";
import PendingPayment from "./account/PendingPayment";
import RoomHistory from "./account/RoomHistory";
import RoomAvailability from "./RoomAvailability";
import AllDamagedReports from "./account/AllDamagedReport";
import 'rsuite/dist/rsuite-no-reset.min.css';
import './App.css';
import ManageComplaints from "./account/ManageComplaints";
import MyComplaints from "./account/MyComplaints";
import SendComplaints from "./account/SendComplaints";
import AllTransactionHistory from "./account/AllTransactionHistory";
import CreateMaintenance from "./account/CreateMaintenance";
import AllMaintenanceRequests from "./account/AllMaintenceRequests";
import CreateAnnouncement from "./account/CreateAnnouncement";
import ManageAnnoucement from "./account/ManageAnnoucement";

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
        <Route path="/room-availability" element={<RoomAvailability />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/onboarding/onboarding" element={<Onboarding />} />
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
          <Route path="/account/manageusers" element={<ManageUsers />} />
          <Route path="/account/adduser" element={<AddNewUser />} />
          <Route path="/account/changeuserpassword" element={<ChangeUserPassword />} />
          <Route path="/account/sendnewsletter" element={<SendNewsletter />} />
          <Route path="/account/allnewsletter" element={<AllNewsletter />} />
          <Route path="/account/newslettersubscribers" element={<NewsletterSubscribers />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/pendingpayment" element={<PendingPayment />} />
          <Route path="/account/roomhistory" element={<RoomHistory />} />
          <Route path="/account/alldamagedreports" element={<AllDamagedReports />} />
          <Route path="/account/managecomplaints" element={<ManageComplaints />} />
          <Route path="/account/mycomplaints" element={<MyComplaints />} />
          <Route path="/account/sendcomplaints" element={<SendComplaints />} />
          <Route path="/account/alltransactionhistory" element={<AllTransactionHistory />} />
          <Route path="/account/createmaintenance" element={<CreateMaintenance />} />
          <Route path="/account/allmaintenancerequests" element={<AllMaintenanceRequests />} />
          <Route path="/account/create-announcement" element={<CreateAnnouncement />} />
          <Route path="/account/manage-announcement" element={<ManageAnnoucement />} />
        </Route>
      </Routes>
     </UserProvider>
    </>
  )
}

export default App
