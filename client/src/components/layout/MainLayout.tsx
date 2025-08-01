import type React from 'react'
import Sidebar from '../Sidebar'
import { useEffect } from 'react'
import { useAccount } from '../../contexts/AccountContext'
import { useTransactions } from '../../contexts/TransactionsContext'
import MobileSidebar from '../MobileSidebar'
import { useUser } from '../../contexts/UserContext'
import Loader from '../Loader'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
	const { user, loading, fetchUser } = useUser()
	const { accounts, setAccounts } = useAccount()
	const { transactions, setTransactions } = useTransactions()

	const fetchAccounts = async () => {
		try {
			const response = await fetch('/api/plaid/accounts/get', {
				credentials: 'include',
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
			await syncTransactions()
			const response = await fetch('/api/plaid/transactions/list', {
				credentials: 'include',
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
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
			})
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchUser()
		if (!loading && user?.id) {
			fetchTransactions()
			fetchAccounts()
		}
	}, [loading, user?.id])

	return (
		<div className="min-h-dvh w-full bg-stone-50 text-slate-950 p-4 gap-4 flex flex-col lg:grid lg:grid-cols-[16rem_1fr]">
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			<main className="box-border bg-white rounded-2xl shadow w-full h-full p-5 not-lg:pb-20 flex flex-col overflow-hidden relative">
				{accounts.length && transactions.length ? (
					children
				) : (
					<Loader backgroundColor="bg-transparent" color="#d4d4d4" />
				)}
			</main>

			<div className="lg:hidden">
				<MobileSidebar />
			</div>
		</div>
	)
}

export default MainLayout
