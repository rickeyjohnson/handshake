import { useEffect } from 'react'
import { LogoutButton } from '../components/LogoutButton'
import { useUser } from '../contexts/UserContext'
import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'
import Sidebar from '../components/Sidebar/Sidebar'

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
		<div className='w-screen h-screen flex bg-neutral-100'>
			<Sidebar />
			<main className='box-border bg-white m-3 w-full rounded-2xl'>
				content
			</main>
		</div>
	)
}

export default Dashboard
