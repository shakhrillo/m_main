import React, { useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseProvider';

const Logout: React.FC = () => {
  const { logout } = useFirebase()
  useEffect(() => {
    logout().then(() => {
      window.location.href = '/login';
    });
  }, []);

  return (
    <div>
      <h2>Logging Out...</h2>
      <p>You have been logged out.</p>
    </div>
  );
};

export default Logout;
