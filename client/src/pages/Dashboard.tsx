import { useEffect, useState } from 'react'
import Accounts from '../components/Accounts'
import CalendarSummary from '../components/CalendarSummary'
import MainHeader from '../components/layout/MainHeader'
import MainLayout from '../components/layout/MainLayout'
import NetWorth from '../components/NetWorth'
import Spending from '../components/Spending'
import Transactions from '../components/Transactions'
import { useAccount } from '../contexts/AccountContext'
import { useUser } from '../contexts/UserContext'
import type { DashboardData } from '../types/types'
import { useTransactions } from '../contexts/TransactionsContext'
import { calculateSpendingData, calculateTotalSpending } from '../utils/utils'
import Balances from '../components/Balances'
import { IconLoader2 } from '@tabler/icons-react'
import Chart from '../components/Chart'

const Dashboard = () => {
	const { user } = useUser()
	const { accounts } = useAccount()
	const { transactions } = useTransactions()

	const [dashboard, setDashboard] = useState<DashboardData>({
		netWorth: 0,
		userNetWorth: 0,
		partnerNetWorth: 0,
		spending: 0,
		spending_data: [],
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
			spending_data: calculateSpendingData(transactions),
		}))
	}, [accounts])

	return (
		<MainLayout>
			<MainHeader
				title={`Welcome ${user?.name || 'Partner'}`}
				caption={`Today is ${new Date().toDateString()}`}
			/>
			{accounts && transactions ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1fr_3fr] items-start gap-7">
					<NetWorth
						networth={dashboard.netWorth}
						userNetworth={dashboard.userNetWorth}
						partnerNetworth={dashboard.partnerNetWorth}
					/>

					<Spending
						total={dashboard.spending}
						data={dashboard.spending_data}
					/>

					<Accounts />

					<div className="order-last lg:order-none md:col-span-2 lg:col-span-2 overflow-x-auto">
						<Transactions />
					</div>

					<div className="grid grid-rows-2 grid-cols-1">
						<Balances />
						<CalendarSummary />
					</div>
				</div>
			) : (
				<div className="w-full h-full flex justify-center items-center">
					<IconLoader2
						color="#ededed"
						size={75}
						className="animate-spin"
					/>
				</div>
			)}

			<Chart
				data={[
					{ x: 0, y: 10 },
					{ x: 10, y: 50 },
					{ x: 20, y: 30 },
					{ x: 30, y: 100 },
					{ x: 40, y: 60 },
				]}
			/>
		</MainLayout>
	)
}

export default Dashboard
