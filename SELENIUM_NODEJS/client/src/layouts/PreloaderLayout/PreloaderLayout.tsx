// src/layouts/PreloaderLayout/PreloaderLayout.tsx

import React, { useState, useEffect } from "react"
import Preloader from "./Preloader"
import { useFirebase } from "../../contexts/FirebaseProvider"

interface PreloaderLayoutProps {
  children: React.ReactNode
}

const PreloaderLayout: React.FC<PreloaderLayoutProps> = ({ children }) => {
  const { checkAuth, isLoading } = useFirebase()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{isLoading ? <Preloader /> : children}</>
}

export default PreloaderLayout
