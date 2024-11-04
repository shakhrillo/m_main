import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent: React.FC = () => {
  return (
    <div className="dashboard__content">
      <Outlet />
    </div>
  );
};

export default MainContent;
