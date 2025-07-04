import { useEffect } from 'react'
import { LogoutButton } from '../components/LogoutButton'
import { useUser } from '../contexts/UserContext'
import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'

const Dashboard = () => {
	const { user } = useUser()
	const { accounts, setAccounts } = useAccount()
	const { transactions, setTransactions } = useTransactions()

	const fetchAccounts = async () => {
		try {
			const response = await fetch('/api/plaid/accounts/get', {
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await response.json()

			setAccounts(data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchTransactions = async () => {
		try {
			const response = await fetch('/api/plaid/transactions/list', {
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await response.json()
			setTransactions(data)
		} catch (err) {
			console.error(err)
		}
	}

	const syncTransactions = async () => {
		try {
			await fetch('/api/plaid/transactions/sync', {
				headers: { 'Content-Type': 'application/json' },
			})
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchAccounts()
		syncTransactions()
		fetchTransactions()
	}, [])

	return (
		<div>
			{user ? (
				<p className="capitalize">Hello, {user.name}</p>
			) : (
				<p>Hello, User</p>
			)}

			<p className="text-3xl">Acccounts</p>
			<pre>{JSON.stringify(accounts, null, 4)}</pre>

			<p className="text-3xl">Transactions</p>
			<pre>{JSON.stringify(transactions, null, 4)}</pre>

			<LogoutButton />
		</div>
	)
}

export default Dashboard
