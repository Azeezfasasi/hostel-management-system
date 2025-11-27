import React from 'react';
import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import GridIcon from '@rsuite/icons/Grid';
import { useUser } from '../../context-api/user-context/UseUser';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import TreeIcon from '@rsuite/icons/Tree';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import DocPassIcon from '@rsuite/icons/DocPass';
import UserChangeIcon from '@rsuite/icons/UserChange';
import SentToUserIcon from '@rsuite/icons/SentToUser';
import AdminIcon from '@rsuite/icons/Admin';
import PeopleSpeakerIcon from '@rsuite/icons/PeopleSpeaker';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import TableIcon from '@rsuite/icons/Table';
import ModelIcon from '@rsuite/icons/Model';

function DashMenu() {
    const {isSuperAdmin, isAdmin, isStudent, isStaff} = useUser()
    const location = useLocation();

    // Map route paths to eventKeys and parent menu keys
    const menuKeyByPath = {
        '/app/dashboard': { key: '1', parent: null },
        '/account/myroomdetails': { key: '2-1', parent: '2' },
        '/account/hostellist': { key: '2-2', parent: '2' },
        '/account/roomlist': { key: '2-3', parent: '2' },
        '/account/roomrequest': { key: '2-4', parent: '2' },
        '/account/adminroomrequests': { key: '2-5', parent: '2' },
        '/account/roomallocation': { key: '2-6', parent: '2' },
        '/account/assignrooms': { key: '2-7', parent: '2' },
        '/account/currentroomallocation': { key: '2-8', parent: '2' },
        '/account/roomhistory': { key: '2-9', parent: '2' },
        '/account/allfurnitures': { key: '3-2', parent: '3' },
        '/account/addfurnitures': { key: '3-3', parent: '3' },
        '/account/addfurniturecategory': { key: '3-4', parent: '3' },
        '/account/damagereportform': { key: '3-5', parent: '3' },
        '/account/alldamagedreports': { key: '3-6', parent: '3' },
        '/account/managestudents': { key: '4-1', parent: '4' },
        '/account/adduser': { key: '4-2', parent: '4' },
        '/account/manageusers': { key: '7-1', parent: '7' },
        '/account/changeuserpassword': { key: '7-3', parent: '7' },
        '/account/sendnewsletter': { key: '8-1', parent: '8' },
        '/account/allnewsletter': { key: '8-2', parent: '8' },
        '/account/newslettersubscribers': { key: '8-3', parent: '8' },
        '/account/mycomplaints': { key: '9-1', parent: '9' },
        '/account/managecomplaints': { key: '9-2', parent: '9' },
        '/account/sendcomplaints': { key: '9-3', parent: '9' },
        '/account/alltransactionhistory': { key: '10-1', parent: '10' },
        '/account/mytransactionhistory': { key: '10-2', parent: '10' },
        '/account/pendingpayment': { key: '10-3', parent: '10' },
        '/account/create-announcement': { key: '11-1', parent: '11' },
        '/account/manage-announcement': { key: '11-2', parent: '11' },
        '/account/profile': { key: '12', parent: null },
        // Add more mappings as needed
    };


    // Normalize pathname to handle trailing slashes and query params
    const cleanPath = location.pathname.replace(/\/$/, '').split('?')[0];
    const routeInfo = menuKeyByPath[location.pathname] || menuKeyByPath[cleanPath];
    const activeKey = routeInfo ? routeInfo.key : null;
    // Compute defaultOpenKeys for Sidenav
    let defaultOpenKeys = [];
    if (routeInfo) {
        if (routeInfo.parent) {
            defaultOpenKeys = [routeInfo.parent];
        } else if (Object.values(menuKeyByPath).some(info => info.parent === routeInfo.key)) {
            defaultOpenKeys = [routeInfo.key];
        }
    }

  return (
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
        <Sidenav defaultOpenKeys={defaultOpenKeys}> 
            <Sidenav.Body>
                <Nav activeKey={activeKey}>
                    {(isSuperAdmin || isAdmin || isStudent || isStaff) && (
                    <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/account/dashboard">
                        Dashboard
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                    <Nav.Menu eventKey="2" title="Hostel" icon={<AppSelectIcon />}>
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-1" as={Link} to="/account/myroomdetails">My Room Details</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-2" as={Link} to="/account/hostellist">Hostel List</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-3" as={Link} to="/account/roomlist">Manage Rooms</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-4" as={Link} to="/account/roomrequest">Request a Room</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="2-5" as={Link} to="/account/adminroomrequests">All Room Request</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-6" as={Link} to="/account/roomallocation">Room Allocations</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-7" as={Link} to="/account/assignrooms">Assign Rooms</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="2-8" as={Link} to="/account/currentroomallocation">Occupancy</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="2-9" as={Link} to="/account/roomhistory">Room History</Nav.Item>
                        )}
                    </Nav.Menu>
                    )}
                    <Nav.Menu eventKey="3" title="Facilities" icon={<TreeIcon />}>
                        {(isStudent) && (
                        <Nav.Item eventKey="3-1" as={Link} to="">My Facilities</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-2" as={Link} to="/account/allfurnitures">All Facilities</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-3" as={Link} to="/account/addfurnitures">Add Facilities</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-4" as={Link} to="/account/addfurniturecategory">Add Category</Nav.Item>
                        )}
                        {(isStudent || isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="3-5" as={Link} to="/account/damagereportform">Report Damage</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-6" as={Link} to="/account/alldamagedreports">All Damage Reports</Nav.Item>
                        )}
                    </Nav.Menu>
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="4" title="Students" icon={<AdminIcon />}>
                        <Nav.Item eventKey="4-1" as={Link} to="/account/managestudents">Manage Students</Nav.Item>
                        <Nav.Item eventKey="4-2" as={Link} to="/account/adduser">Add Students</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Menu eventKey="5" title="Blog Post" icon={<DocPassIcon />}>
                        <Nav.Item eventKey="5-1" as={Link} to="">All Blog Posts</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="">Create Blog Post</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="7" title="Users" icon={<UserChangeIcon />}>
                        <Nav.Item eventKey="7-1" as={Link} to="/account/manageusers">Manage Users</Nav.Item>
                        <Nav.Item eventKey="7-2" as={Link} to="/account/adduser">Create a User</Nav.Item>
                        <Nav.Item eventKey="7-3" as={Link} to="/account/changeuserpassword">Change User Password</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="8" title="Newsletter" icon={<PeopleSpeakerIcon />}>
                        <Nav.Item eventKey="8-1" as={Link} to="/account/sendnewsletter">Send Newsletters</Nav.Item>
                        <Nav.Item eventKey="8-2" as={Link} to="/account/allnewsletter">All Newsletter</Nav.Item>
                        <Nav.Item eventKey="8-3" as={Link} to="/account/newslettersubscribers">Subscribers</Nav.Item>
                    </Nav.Menu>
                    )}
                    <Nav.Menu eventKey="9" title="Complaints" icon={<DetailIcon />}>
                        {(isStudent) && (
                        <Nav.Item eventKey="9-1" as={Link} to="/account/mycomplaints">My Complaints</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="9-2" as={Link} to="/account/managecomplaints">Manage Complaints</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="9-3" as={Link} to="/account/sendcomplaints">Send a Complaint</Nav.Item>
                        )}
                    </Nav.Menu>
                    
                    <Nav.Menu eventKey="10" title="Accounts" icon={<TableIcon />}>
                        {(isAdmin || isSuperAdmin || isStaff) && (
                        <Nav.Item eventKey="10-1" as={Link} to="/account/alltransactionhistory">All Transaction History</Nav.Item>
                        )}
                        {(isStudent) && (
                        <Nav.Item eventKey="10-2" as={Link} to="">My Transaction History</Nav.Item>
                        )}
                        {(isStudent) && (
                        <Nav.Item eventKey="10-3" as={Link} to="/account/pendingpayment">My Pending Payments</Nav.Item>
                        )}
                        {(isStudent) && (
                        <Nav.Item eventKey="10-4" as={Link} to="">Overdue</Nav.Item>
                        )}
                    </Nav.Menu>

                    <Nav.Menu eventKey="11" title="Announcements" icon={<TableIcon />}>
                        {(isAdmin || isSuperAdmin || isStaff) && (
                        <Nav.Item eventKey="11-1" as={Link} to="/account/create-announcement">Create Announcement</Nav.Item>
                        )}
                        {(isAdmin || isSuperAdmin || isStaff) && (
                        <Nav.Item eventKey="11-2" as={Link} to="/account/manage-announcement">Manage Announcements</Nav.Item>
                        )}
                    </Nav.Menu>

                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Item eventKey="12" icon={<UserBadgeIcon />} as={Link} to="/account/profile">
                        Profile
                    </Nav.Item>
                    )}
                </Nav>
            </Sidenav.Body>
        </Sidenav>
    </div>
    </>
  )
}

export default DashMenu



