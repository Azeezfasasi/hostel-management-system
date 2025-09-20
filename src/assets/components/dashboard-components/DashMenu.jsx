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

  // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': '1',
    '/account/myroomdetails': '2-1',
    '/account/hostellist': '2-2',
    '/account/roomlist': '2-3',
    '/account/roomrequest': '2-4',
    '/account/adminroomrequests': '2-5',
    '/account/roomallocation': '2-6',
    '/account/assignrooms': '2-7',
    '/account/currentroomallocation': '2-8',
    '/account/roomhistory': '2-9',
    '/account/allfurnitures': '3-2',
    '/account/addfurnitures': '3-3',
    '/account/addfurniturecategory': '3-4',
    '/account/damagereportform': '3-5',
    '/account/alldamagedreports': '3-6',
    '/account/managestudents': '4-1',
    '/account/manageusers': '7-1',
    '/account/adduser': '7-2',
    '/account/changeuserpassword': '7-3',
    '/account/sendnewsletter': '8-1',
    '/account/allnewsletter': '8-2',
    '/account/newslettersubscribers': '8-3',
    '/account/pendingpayment': '10-3',
    '/account/profile': '12',
    // Add more mappings as needed
  };
  const activeKey = menuKeyByPath[location.pathname];

  return (
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
        <Sidenav> 
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
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
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
                    <Nav.Menu eventKey="5" title="Attendance" icon={<DocPassIcon />}>
                        <Nav.Item eventKey="5-1" as={Link} to="">All Attendance</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="">In</Nav.Item>
                        <Nav.Item eventKey="5-3" as={Link} to="">Out</Nav.Item>
                        <Nav.Item eventKey="5-4" as={Link} to="">Leave</Nav.Item>
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
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="9-1" as={Link} to="">Manage Complaints</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="9-2" as={Link} to="">Send a Complaint</Nav.Item>
                        )}
                    </Nav.Menu>
                    
                    <Nav.Menu eventKey="10" title="Accounts" icon={<TableIcon />}>
                        {(isAdmin || isSuperAdmin || isStaff) && (
                        <Nav.Item eventKey="10-1" as={Link} to="">All Transaction History</Nav.Item>
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
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Item eventKey="11" icon={<ModelIcon />} as={Link} to="">
                        Maintenance
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
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

