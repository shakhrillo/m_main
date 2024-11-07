// src/layouts/PreloaderLayout/PreloaderLayout.tsx

import React, { useEffect, useState } from "react"
import { checkAuth } from "../../services/firebaseService"
import Preloader from "./Preloader"

interface PreloaderLayoutProps {
  children: React.ReactNode
}

const PreloaderLayout: React.FC<PreloaderLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth().then(() => setIsLoading(false))
  }, [])

  return <>{isLoading ? <Preloader /> : children}</>
}

export default PreloaderLayout
