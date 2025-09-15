import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/assets/context-api/user-context/UseUser';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import { Sidenav, Nav } from 'rsuite';
import ProjectIcon from '@rsuite/icons/Project';
import profile from '../../images/profile.png';

function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [linkOpen, setLinkOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
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
    '/account/managestudents': '4-1',
    '/account/manageusers': '7-1',
    '/account/adduser': '7-2',
    '/account/changeuserpassword': '7-3',
    '/account/sendnewsletter': '8-1',
    '/account/allnewsletter': '8-2',
    '/account/newslettersubscribers': '8-3',
    '/account/profile': '12',
  };
  const activeKey = menuKeyByPath[location.pathname];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setProfileMenuOpen(false);
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  return (
    <div className="bg-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50 border-b border-solid border-gray-500">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        {/* <img src={marshalllogo} alt="logo"  className='w-[150px] h-[40px]'/> */}
        <span className="text-2xl font-bold text-[#0A1F44]">HMS</span>
      </Link>

      {/* Hamburger Icon (Mobile) */}
      <div className="lg:hidden flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2 ml-4 relative profile-dropdown">
          <div className="relative">
            <img
              src={profile}
              alt="profile"
              className="w-8 h-8 rounded-full border border-solid border-gray-200 cursor-pointer"
              onClick={() => setProfileMenuOpen((open) => !open)}
            />
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute top-10 right-[-150px] mt-2 w-44 bg-white border border-solid border-gray-300 rounded shadow-lg z-50 animate-fade-in">
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>My Orders</Link>
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>My Quotes</Link>
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Profile</Link>                
                <button
                  onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >Logout</button>
              </div>
            )}
          </div>

          {/* Username and role */}
          <div className="flex flex-col text-xs cursor-pointer" onClick={() => setProfileMenuOpen((open) => !open)}>
            <span className="font-semibold">{user?.firstName}</span>
            <span className="text-gray-500 text-[12px] capitalize">{user.role}</span>
          </div>
        </div>
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#0A1F44] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Navigation */}
      <div className="hidden lg:flex space-x-6 font-medium text-[#0A1F44] items-center">
        <Link to="/">Home</Link>
        <Link to="/">Students</Link>
        <Link to="/">Rooms</Link>
        <div className="flex flex-row items-center gap-2 ml-4 relative profile-dropdown">
          <div className="relative">
            <img
              src={profile}
              alt="profile"
              className="w-8 h-8 rounded-full border border-solid border-gray-200 cursor-pointer"
              onClick={() => setProfileMenuOpen((open) => !open)}
            />
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute top-10 right-[-90px] mt-2 w-44 bg-white border border-solid border-gray-300 rounded shadow-lg z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-solid border-gray-300">
                  <span className="font-semibold block">{user?.firstName}</span>
                  <span className="text-gray-500 text-xs capitalize">{user?.role}</span>
                </div>
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                {(isSuperAdmin || isAdmin) && (
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Rooms</Link>
                )}
                {(isSuperAdmin || isAdmin) && (
                  <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Manage Students</Link>
                )}
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Complaint</Link>
                <button
                  onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >Logout</button>
              </div>
            )}
          </div>
          <div className="flex flex-col text-xs cursor-pointer" onClick={() => setProfileMenuOpen((open) => !open)}>
            <span className="font-semibold">{user?.firstName}</span>
            <span className="text-gray-500 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start pl-0 py-0 z-50 lg:hidden animate-fade-in border-b h-[600px] overflow-y-scroll overflow-x-hidden">
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
                </Nav.Menu>
                )}
                <Nav.Menu eventKey="3" title="Furniture" icon={<GridIcon />}>
                    {(isStudent) && (
                    <Nav.Item eventKey="3-1" as={Link} to="">My Furnitures</Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
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
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="4-2" as={Link} to="/account/adduser">Add Students</Nav.Item>
                    )}
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
                {(isSuperAdmin || isAdmin) && (
                <Nav.Menu eventKey="7" title="Users" icon={<GridIcon />}>
                    <Nav.Item eventKey="7-1" as={Link} to="/account/manageusers">Manage Users</Nav.Item>
                    <Nav.Item eventKey="7-2" as={Link} to="/account/adduser">Create a User</Nav.Item>
                    <Nav.Item eventKey="7-3" as={Link} to="/account/changeuserpassword">Change User Password</Nav.Item>
                </Nav.Menu>
                )}
                {(isSuperAdmin || isAdmin) && (
                <Nav.Menu eventKey="8" title="Newsletter" icon={<GridIcon />}>
                    <Nav.Item eventKey="8-1" as={Link} to="/account/sendnewsletter">Send Newsletters</Nav.Item>
                    <Nav.Item eventKey="8-2" as={Link} to="/account/allnewsletter">All Newsletter</Nav.Item>
                    <Nav.Item eventKey="8-3" as={Link} to="/account/newslettersubscribers">Subscribers</Nav.Item>
                </Nav.Menu>
                )}
                <Nav.Menu eventKey="9" title="Complaints" icon={<GridIcon />}>
                    {(isSuperAdmin || isAdmin || isStaff) && (
                    <Nav.Item eventKey="9-1" as={Link} to="">Manage Complaints</Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                    <Nav.Item eventKey="9-2" as={Link} to="">Send a Complaint</Nav.Item>
                    )}
                </Nav.Menu>
                
                <Nav.Menu eventKey="10" title="Accounts" icon={<GridIcon />}>
                    {(isAdmin || isSuperAdmin || isStaff) && (
                    <Nav.Item eventKey="10-1" as={Link} to="">All Transaction History</Nav.Item>
                    )}
                    {(isStudent) && (
                    <Nav.Item eventKey="10-2" as={Link} to="">My Transaction History</Nav.Item>
                    )}
                    {(isStudent) && (
                    <Nav.Item eventKey="10-3" as={Link} to="">Overdue</Nav.Item>
                    )}
                </Nav.Menu>
                {(isSuperAdmin || isAdmin || isStaff) && (
                <Nav.Item eventKey="11" icon={<DetailIcon />} as={Link} to="">
                    Maintenance
                </Nav.Item>
                )}
                {(isSuperAdmin || isAdmin || isStaff || isStudent) && (
                <Nav.Item eventKey="12" icon={<DetailIcon />} as={Link} to="/account/profile">
                    Profile
                </Nav.Item>
                )}
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <button onClick={() => { setProfileMenuOpen(false); handleLogout(); }} className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">Logout</button>
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;