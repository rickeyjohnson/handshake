import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { WithAuth } from './components/WithAuth'
import LinkPlaid from './pages/LinkPlaid'
import NotFound from './pages/NotFound'
import PairPage from './pages/PairPage'
import TransactionsPage from './pages/TransactionsPage'
import SpendingPage from './pages/SpendingPage'
import BudgetsPage from './pages/BudgetsPage'
import GoalsPage from './pages/GoalsPage'
import GoalDetailsPage from './pages/GoalDetailsPage'
import AddExpensePage from './pages/AddExpensePage'

const App = () => {
	const ProtectedDashboardPage = WithAuth(Dashboard)
	const ProtectedLinkPlaid = WithAuth(LinkPlaid)
	const ProtectedPairPage = WithAuth(PairPage)
	const ProtectedTransactionPage = WithAuth(TransactionsPage)
	const ProtectedSpendingPage = WithAuth(SpendingPage)
	const ProtectedBudgetsPage = WithAuth(BudgetsPage)
	const ProtectedGoalsPage = WithAuth(GoalsPage)
	const ProtectedGoalDetailsPage = WithAuth(GoalDetailsPage)
	const ProtectedAddExpensePage = WithAuth(AddExpensePage)

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/signup" element={<SignUpPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/dashboard" element={<ProtectedDashboardPage />} />
			<Route path="/connect-bank" element={<ProtectedLinkPlaid />} />
			<Route path="/pair" element={<ProtectedPairPage />} />
			<Route
				path="/transactions"
				element={<ProtectedTransactionPage />}
			/>
			<Route path="/transactions/add-expense" element={<ProtectedAddExpensePage />}/>
			<Route path="/spending" element={<ProtectedSpendingPage />} />
			<Route path="/budgets" element={<ProtectedBudgetsPage />} />
			<Route path="/goals" element={<ProtectedGoalsPage />} />
			<Route path="/goals/:id" element={<ProtectedGoalDetailsPage />} />
			<Route path="/*" element={<NotFound />} />
		</Routes>
	)
}

export default App
