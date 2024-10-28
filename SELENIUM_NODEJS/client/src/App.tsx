// src/App.tsx
import React from 'react';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  return (
    <div>
      <h2>
        Welcome to the App
      </h2>
      <hr />
      <AppRoutes />
    </div>
  );
};

export default App;
