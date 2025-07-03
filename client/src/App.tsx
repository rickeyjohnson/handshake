import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { WithAuth } from './components/WithAuth'
import LinkPlaid from './pages/LinkPlaid'
import NotFound from './pages/NotFound'
import PairPage from './pages/PairPage'

const App = () => {
	const ProtectedDashboard = WithAuth(Dashboard)
	const ProtectedLinkPlaid = WithAuth(LinkPlaid)
	const ProtectedPairPage = WithAuth(PairPage)

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/signup" element={<SignUpPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/dashboard" element={<ProtectedDashboard />} />
			<Route path="/connect-bank" element={<ProtectedLinkPlaid />} />
			<Route path="/pair" element={<ProtectedPairPage />} />
			<Route path="/*" element={<NotFound />} />
		</Routes>
	)
}

export default App
