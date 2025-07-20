import type React from 'react'
import Sidebar from '../Sidebar'
import { useEffect } from 'react'
import { useAccount } from '../../contexts/AccountContext'
import { useTransactions } from '../../contexts/TransactionsContext'
import MobileSidebar from '../MobileSidebar'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
	const { setAccounts } = useAccount()
	const { setTransactions } = useTransactions()

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
		<div className="min-w-screen min-h-dvh bg-stone-50 text-slate-950 grid gap-4 p-4 lg:grid-cols-[16rem_1fr]">
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			<main className="box-border bg-white rounded-2xl shadow min-h-[100vh-16px] min-w-3xl w-full p-8 pt-5 flex flex-col">
				{children}
			</main>

			<MobileSidebar />
		</div>
	)
}

export default MainLayout
