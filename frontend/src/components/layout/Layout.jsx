import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeaveSidebar from './LeaveSidebar';

const Layout = () => {
  return (
    <>
      <Header />
      <div className="shell">
        <LeaveSidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
