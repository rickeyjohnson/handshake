import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { WithAuth } from './components/WithAuth'

const App = () => {
	const ProtectedDashboard = WithAuth(Dashboard)

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/signup" element={<SignUpPage />} />
			<Route path="/login" element={<LoginPage />} />
      		<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	)
}

export default App
