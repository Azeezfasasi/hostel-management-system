import React, { useEffect, useState } from 'react';
import { useUser } from '../../context-api/user-context/UseUser';
import { useQuote } from '../../context-api/Request-quote-context/UseQuote';
import Spinner from '../Spinner';
import { API_BASE_URL } from '../../../config/api';
import { Link } from 'react-router-dom';

function DashStats() {
  const { getAllUsers, loading: userLoading, isSuperAdmin, isAdmin, isCustomer, user } = useUser();
  const { quotes, loading: quoteLoading, fetchCustomerQuotes } = useQuote(); // Added fetchCustomerQuotes
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdmins: 0,
    admins: 0,
    customers: 0,
    users: 0,
    totalQuotes: 0, // Total quotes for admin view
    myQuotes: 0,    // Quotes for customer/user view
    myPending: 0,
    myCompleted: 0,
  });
  const [orderCount, setOrderCount] = useState(0); // For admin total orders
  const [customerOrderCount, setCustomerOrderCount] = useState(0); // For customer's own orders
  const [orderLoading, setOrderLoading] = useState(false);

  // Fetch user-related stats conditionally for admins
  useEffect(() => {
    const fetchUserStats = async () => {
      if (isSuperAdmin || isAdmin) { // <--- CRUCIAL CHANGE: Only fetch users if admin
        const users = await getAllUsers();
        setStats(prev => ({
          ...prev,
          totalUsers: users ? users.length : 0,
          superAdmins: users ? users.filter(u => u.role === 'super admin').length : 0,
          admins: users ? users.filter(u => u.role === 'admin').length : 0,
          customers: users ? users.filter(u => u.role === 'customer').length : 0,
          users: users ? users.filter(u => u.role === 'user').length : 0,
        }));
      }
    };
    fetchUserStats();
    // Dependencies: isSuperAdmin, isAdmin to re-run if role changes (e.g., after login)
  }, [isSuperAdmin, isAdmin, getAllUsers]); // Added getAllUsers to dependencies

  // Fetch total orders for admin/super admin
  useEffect(() => {
    const fetchOrders = async () => {
      if (isSuperAdmin || isAdmin) {
        setOrderLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_BASE_URL}/orders`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setOrderCount(Array.isArray(data) ? data.length : 0);
          } else {
            setOrderCount(0);
          }
        } catch {
          setOrderCount(0);
        } finally {
          setOrderLoading(false);
        }
      }
    };
    fetchOrders();
  }, [isSuperAdmin, isAdmin]);

  // Fetch total orders for customers
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (isCustomer) { // <--- Already conditional, which is good
        setOrderLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setCustomerOrderCount(Array.isArray(data) ? data.length : 0);
          } else {
            setCustomerOrderCount(0);
          }
        } catch {
          setCustomerOrderCount(0);
        } finally {
          setOrderLoading(false);
        }
      }
    };
    fetchCustomerOrders();
  }, [isCustomer]);

  // Update quotes count when quotes or user changes
  useEffect(() => {
    let myQuotes = 0, myPending = 0, myCompleted = 0;
    let totalQuotesForAdmin = 0; // Initialize for admin view

    if (quotes) {
      if (isSuperAdmin || isAdmin) {
        totalQuotesForAdmin = quotes.length; // All quotes for admin
      } else if (user && (user.role === 'user' || user.role === 'customer')) {
        // For customer/user, filter quotes by their email
        const userQuotes = quotes.filter(q => q.email === user.email);
        myQuotes = userQuotes.length;
        myPending = userQuotes.filter(q => q.status === 'Pending').length;
        myCompleted = userQuotes.filter(q => q.status === 'Completed' || q.status === 'Done').length;
      }
    }

    setStats(prev => ({
      ...prev,
      totalQuotes: totalQuotesForAdmin, // Set totalQuotes for admin view
      myQuotes,
      myPending,
      myCompleted,
    }));
  }, [quotes, user, isSuperAdmin, isAdmin]); // Added isSuperAdmin, isAdmin to dependencies

  // Fetch customer quotes specifically for customer role
  useEffect(() => {
    if (isCustomer && user && user.email) {
      fetchCustomerQuotes(); // This will update the 'quotes' state in useQuote context
    }
  }, [isCustomer, user, fetchCustomerQuotes]); // Depend on user and fetchCustomerQuotes

  if (userLoading || quoteLoading || orderLoading) {
    return <Spinner />;
  }

  return (
    <>
      {(isSuperAdmin || isAdmin) ? (
        <>
          {user && (
            <div className="col-span-3 text-xl font-semibold mb-2 md:mb-2 mt-3 px-4 lg:px-5">
              <p className='font-semibold'>Welcome {user.name || user.email || 'Admin'}!</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Only show user stats for admins */}
            <Link to="/app/allusers">
              <StatCard label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
            </Link>
            <Link to="/app/allusers">
              <StatCard label="Super Admins" value={stats.superAdmins} color="bg-purple-700" />
            </Link>
            <Link to="/app/allusers">
              <StatCard label="Admins" value={stats.admins} color="bg-indigo-600" />
            </Link>
            <Link to="/app/allusers">
              <StatCard label="Customers" value={stats.customers} color="bg-green-600" />
            </Link>
            <Link to="/app/adminorderlist">
              <StatCard label="Order Received" value={orderCount} color="bg-yellow-500" />
            </Link>
            <Link to="/app/quote">
              <StatCard label="Quotes Received" value={stats.totalQuotes} color="bg-pink-600" />
            </Link>
          </div>
        </>
      ) : (user && (user.role === 'customer' || user.role === 'user')) ? ( // Combined customer and user roles
        <>
          <div className="col-span-3 text-xl font-semibold mb-2 md:mb-2 mt-3 px-4 lg:px-5">
            <p className='font-semibold'>Welcome {user.name || user.email || 'User'}!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {(isCustomer) && ( // Only show "My Orders" for actual customers
              <Link to="/app/userorderdetails">
                <StatCard label="My Orders" value={customerOrderCount} color="bg-purple-600" />
              </Link>
            )}
            {/* My Quotes and related stats are visible to both 'customer' and 'user' roles */}
            <Link to="/app/customer/my-quotes"> {/* Link to the new customer quotes list */}
              <StatCard label="My Quotes" value={stats.myQuotes} color="bg-blue-600" />
            </Link>
            <Link to="/app/customer/my-quotes"> {/* Link to the new customer quotes list */}
              <StatCard label="Pending Quotes" value={stats.myPending} color="bg-yellow-500" />
            </Link>
            <Link to="/app/customer/my-quotes"> {/* Link to the new customer quotes list */}
              <StatCard label="Completed Quotes" value={stats.myCompleted} color="bg-green-600" />
            </Link>
          </div>
        </>
      ) : null // Render nothing if no matching role
      }
    </>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center ${color} text-white`}>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-lg font-medium">{label}</div>
    </div>
  );
}

export default DashStats;
