import { useState } from 'react'
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

const Dashboard = () => {
	const { user } = useUser()
	const { accounts } = useAccount()
	const { transactions } = useTransactions()
	
	return (
	<MainLayout>
		<MainHeader title={`Welcome ${user?.name || 'Partner'}`} caption={`Today is ${new Date().toDateString()}`} />
		<NetWorth networth={Math.round(accounts.reduce((sum, acc) => sum + acc.balances.available, 0))} userNetworth={0} partnerNetworth={0}/>

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