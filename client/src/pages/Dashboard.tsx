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
import { useUser } from '../contexts/UserContext'
import type { DashboardData } from '../types/types'
import { useTransactions } from '../contexts/TransactionsContext'
import { calculateTotalSpending } from '../utils/utils'

const Dashboard = () => {
	const { user } = useUser()
	const { accounts } = useAccount()
	const { transactions } = useTransactions()

	const [dashboard, setDashboard] = useState<DashboardData>({
		netWorth: 0,
		userNetWorth: 0,
		partnerNetWorth: 0,
		spending: 0,
	})

	useEffect(() => {
		setDashboard((prev) => ({
			...prev,
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

			spending: calculateTotalSpending(transactions),
		}))
	}, [accounts])

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

			<Spending total={dashboard.spending} data={[]}/>
			<SpendingBudgetGraph />
			<Transactions />
			<Accounts />
			<CalendarSummary />
			<pre>{JSON.stringify(accounts, null, 4)}</pre>
			<pre>{JSON.stringify(transactions, null, 4)}</pre>
		</MainLayout>
	)
}

export default Dashboard
