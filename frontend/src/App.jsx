import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import RoleLanding from './pages/RoleLanding';
import Profile from './pages/Profile';
import RequireAuth from './components/common/RequireAuth';

// Leave Pages
import LeaveDashboard from './pages/leave/Dashboard';
import ApplyLeave from './pages/leave/ApplyLeave';
import MyApplications from './pages/leave/MyApplications';
import PendingApprovals from './pages/leave/PendingApprovals';
import TeamCalendar from './pages/leave/TeamCalendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<RoleLanding />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leave" element={<LeaveDashboard />} />
          <Route path="leave/apply" element={<ApplyLeave />} />
          <Route path="leave/my-applications" element={<MyApplications />} />
          <Route path="leave/pending" element={<PendingApprovals />} />
          <Route path="leave/calendar" element={<TeamCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
