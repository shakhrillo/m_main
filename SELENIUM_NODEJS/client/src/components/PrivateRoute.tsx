// src/components/PrivateRoute.tsx
import React, { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"

const PrivateRoute: React.FC = () => {
  const { user } = useFirebase()

  useEffect(() => {
    console.log("User", user)
  }, [user])

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export default PrivateRoute
