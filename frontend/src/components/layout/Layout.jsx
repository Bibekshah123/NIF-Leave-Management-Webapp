import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import LeaveSidebar from './LeaveSidebar';

const Layout = () => {
  const location = useLocation();
  const isLeaveModule = location.pathname.startsWith('/leave');
  return (
    <>
      <Header />
      <div className="shell">
        {isLeaveModule ? <LeaveSidebar /> : <Sidebar />}
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
