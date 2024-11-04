// src/layouts/DashboardLayout/DashboardLayout.tsx

import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default DashboardLayout;
