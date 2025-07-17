import { useEffect, useState } from 'react'
import Accounts from '../components/Accounts'
import CalendarSummary from '../components/CalendarSummary'
import MainHeader from '../components/layout/MainHeader'
import MainLayout from '../components/layout/MainLayout'
import NetWorth from '../components/NetWorth'
import Spending from '../components/Spending'
import SpendingBudgetGraph from '../components/SpendingBudgetGraph'
import Transactions from '../components/Transactions'
import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'
import { useUser } from '../contexts/UserContext'
import type { DashboardData } from '../types/types'

const Dashboard = () => {
	const { user } = useUser()
	const { accounts } = useAccount()
	const { transactions } = useTransactions()

	const [dashboard, setDashboard] = useState<DashboardData>({
		netWorth: accounts.reduce(
			(sum, acc) => sum + acc.balances.available,
			0
		),
		userNetWorth: accounts.reduce((sum, acc) => {
			if (acc.user_id === user?.id) {
				return sum + acc.balances.available
			}

			return sum
		}, 0),
		partnerNetWorth: accounts.reduce((sum, acc) => {
			if (acc.user_id === user?.partner.id) {
				return sum + acc.balances.available
			}

			return sum
		}, 0),
	})

	return (
		<MainLayout>
			<MainHeader
				title={`Welcome ${user?.name || 'Partner'}`}
				caption={`Today is ${new Date().toDateString()}`}
			/>
			<NetWorth
				networth={dashboard.netWorth}
				userNetworth={dashboard.userNetWorth}
				partnerNetworth={dashboard.partnerNetWorth}
			/>

			<pre>{JSON.stringify(accounts, null, 4)}</pre>

			<Spending />
			<SpendingBudgetGraph />
			<Transactions />
			<Accounts />
			<CalendarSummary />
		</MainLayout>
	)
}

export default Dashboard
