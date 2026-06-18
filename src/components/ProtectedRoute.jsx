import { useEffect, useState } from "react"

import { Navigate } from "react-router-dom"

import {
  onAuthStateChanged
} from "firebase/auth"

import { auth } from "../firebase/firebase"

function ProtectedRoute({ children }) {

  const [user, setUser] = useState(undefined)

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
      }
    )

    return () => unsubscribe()

  }, [])

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />
  }

  // Logged in
  return children
}

export default ProtectedRoute