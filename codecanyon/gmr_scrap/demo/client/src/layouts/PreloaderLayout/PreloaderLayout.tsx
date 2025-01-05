/**
 * @fileoverview Preloader Layout which will show preloader until the user is authenticated
 */
import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";

interface PreloaderLayoutProps {
  children: React.ReactNode;
}

const PreloaderLayout: React.FC<PreloaderLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    // Show preloader until the user is authenticated
    <div className="d-flex justify-content-center align-items-center position-fixed w-100 h-100 top-0 start-0 bg-white">
      <div className="text-primary text-center">
        <div className="fs-3">Checking Authentication...</div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  ) : (
    // Show the children once the user is authenticated
    children
  );
};

export default PreloaderLayout;
