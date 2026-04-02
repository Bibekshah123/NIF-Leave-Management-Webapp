import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/memo/Dashboard';
import MemoList from './pages/memo/MemoList';
import MemoDetail from './pages/memo/MemoDetail';
import NewMemo from './pages/memo/NewMemo';

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
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/memos" replace />} />
          <Route path="memos" element={<Dashboard />} />
          <Route path="memos/all" element={<MemoList />} />
          <Route path="memos/drafts" element={<MemoList filter="drafts" />} />
          <Route path="memos/new" element={<NewMemo />} />
          <Route path="memos/:id" element={<MemoDetail />} />

          {/* Leave Routes */}
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
