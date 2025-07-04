import { useEffect, useState } from 'react'
import { LogoutButton } from '../components/LogoutButton'
import { useUser } from '../contexts/UserContext'

const Dashboard = () => {
	const { user } = useUser()
	const [transactions, setTransactions] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchTransactions = async () => {
		const response = await fetch('/api/plaid/transactions/list', {
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await response.json()
		setTransactions(data)
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
		setLoading(true)
		syncTransactions()
		fetchTransactions()
		setLoading(false)
	}, [])

	return (
		<div>
			{user ? (
				<p className="capitalize">Hello, {user.name}</p>
			) : (
				<p>Hello, User</p>
			)}

			<p className="text-3xl">Acccounts</p>
			{loading ? (
				'loading ...'
			) : (
				<pre>{JSON.stringify({}, null, 4)}</pre>
			)}

			<p className="text-3xl">Transactions</p>
			{loading ? (
				'loading ...'
			) : (
				<pre>{JSON.stringify(transactions, null, 4)}</pre>
			)}

			<LogoutButton />
		</div>
	)
}

export default Dashboard
