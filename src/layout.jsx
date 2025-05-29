import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Adjust path if needed
import Footer from './components/Footer';
import CustomerPage from './components/customerPage';
import BankerDashboard from './components/banker';

function Layout() {
  const navigate = useNavigate();
  const [roleComponent, setRoleComponent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/signin');
      return;
    }

    if (user.role  === 'admin') {
      setRoleComponent(<BankerDashboard />);
    } else {
      setRoleComponent(<CustomerPage />);
    }
  }, [navigate]);

  return (
    <>
      <Header />
      {roleComponent}
      <Footer />
    </>
  );
}

export default Layout;
