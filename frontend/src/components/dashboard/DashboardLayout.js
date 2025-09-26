import React from 'react';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex sticky top-0 left-0">
      <Sidebar />
      <div className=" w-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;