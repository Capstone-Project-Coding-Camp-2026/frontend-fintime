export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to FinTime
        </h1>

        <p className="text-cyan-400 text-lg">
          Hello, {user?.fullName}
        </p>
      </div>
    </div>
  )
}