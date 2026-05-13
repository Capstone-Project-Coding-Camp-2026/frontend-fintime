import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Samakan dengan LoginPage (fintime_token)
  const token = localStorage.getItem('fintime_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
