import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import { useUser } from '../../context-api/user-context/UseUser';
import ProjectIcon from '@rsuite/icons/Project';

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
    '/account/allfurnitures': '3-2',
    '/account/addfurnitures': '3-3',
    '/account/addfurniturecategory': '3-4',
    '/account/damagereportform': '3-5',
    '/account/managestudents': '4-1'
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
                    <Nav.Menu eventKey="2" title="Hostel" icon={<GridIcon />}>
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-1" as={Link} to="/account/myroomdetails">My Room Details</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="2-2" as={Link} to="/account/hostellist">Hostel List</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-3" as={Link} to="/account/roomlist">Manage Rooms</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-4" as={Link} to="/account/roomrequest">Request a Room</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-5" as={Link} to="/account/adminroomrequests">All Room Request</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="2-6" as={Link} to="/account/roomallocation">Room Allocations</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-7" as={Link} to="/account/assignrooms">Assign Rooms</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="2-8" as={Link} to="/account/currentroomallocation">Occupancy</Nav.Item>
                        )}
                    </Nav.Menu>
                    )}
                    <Nav.Menu eventKey="3" title="Furniture" icon={<GridIcon />}>
                        {(isStudent) && (
                        <Nav.Item eventKey="3-1" as={Link} to="">My Furnitures</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="3-2" as={Link} to="/account/allfurnitures">All Furnitures</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-3" as={Link} to="/account/addfurnitures">Add Furniture</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="3-4" as={Link} to="/account/addfurniturecategory">Add Category</Nav.Item>
                        )}
                        {(isStudent || isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="3-5" as={Link} to="/account/damagereportform">Report Damage</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="3-6" as={Link} to="">All Damage Reports</Nav.Item>
                        )}
                    </Nav.Menu>
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Menu eventKey="4" title="Students" icon={<GridIcon />}>
                        <Nav.Item eventKey="4-1" as={Link} to="/account/managestudents">Manage Students</Nav.Item>
                        <Nav.Item eventKey="4-2" as={Link} to="">Add Students</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Menu eventKey="5" title="Attendance" icon={<GridIcon />}>
                        <Nav.Item eventKey="5-1" as={Link} to="">All Attendance</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="">In</Nav.Item>
                        <Nav.Item eventKey="5-3" as={Link} to="">Out</Nav.Item>
                        <Nav.Item eventKey="5-4" as={Link} to="">Leave</Nav.Item>
                    </Nav.Menu>
                    )}
                    <Nav.Menu eventKey="6" title="Facilities" icon={<GridIcon />}>
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="6-1" as={Link} to="">All Facilities</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin) && (
                        <Nav.Item eventKey="6-2" as={Link} to="">Create Facilities</Nav.Item>
                        )}
                    </Nav.Menu>
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Menu eventKey="7" title="Users" icon={<GridIcon />}>
                        <Nav.Item eventKey="7-1" as={Link} to="">Manage Users</Nav.Item>
                        <Nav.Item eventKey="7-2" as={Link} to="">Create a User</Nav.Item>
                    </Nav.Menu>
                    )}
                    <Nav.Menu eventKey="8" title="Complaints" icon={<GridIcon />}>
                        {(isSuperAdmin || isAdmin || isStaff) && (
                        <Nav.Item eventKey="8-1" as={Link} to="">Manage Complaints</Nav.Item>
                        )}
                        {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                        <Nav.Item eventKey="8-2" as={Link} to="">Send a Complaint</Nav.Item>
                        )}
                    </Nav.Menu>
                    
                    <Nav.Menu eventKey="9" title="Accounts" icon={<GridIcon />}>
                        {(isAdmin || isSuperAdmin || isStaff) && (
                        <Nav.Item eventKey="9-1" as={Link} to="">All Transaction History</Nav.Item>
                        )}
                        {(isStudent) && (
                        <Nav.Item eventKey="9-1" as={Link} to="">My Transaction History</Nav.Item>
                        )}
                        {(isStudent) && (
                        <Nav.Item eventKey="9-2" as={Link} to="">Overdue</Nav.Item>
                        )}
                    </Nav.Menu>
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Item eventKey="10" icon={<DetailIcon />} as={Link} to="">
                        Maintenance
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                    <Nav.Item eventKey="11" icon={<DetailIcon />} as={Link} to="">
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

