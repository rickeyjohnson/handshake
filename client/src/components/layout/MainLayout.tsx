import type React from 'react'
import Sidebar from '../Sidebar'
import { useEffect } from 'react'
import { useAccount } from '../../contexts/AccountContext'
import { useTransactions } from '../../contexts/TransactionsContext'
import MobileSidebar from '../MobileSidebar'
import { WebSocketProvider } from '../../contexts/WebsocketContext'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
	const { setAccounts } = useAccount()
	const { setTransactions } = useTransactions()

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
		fetchAccounts()
		syncTransactions()
		fetchTransactions()
	}, [])

	return (
		<WebSocketProvider>
			<div className="min-h-dvh w-full bg-stone-50 text-slate-950 p-4 gap-4 flex flex-col lg:grid lg:grid-cols-[16rem_1fr]">
				<div className="hidden lg:block">
					<Sidebar />
				</div>

				<main className="bg-white rounded-2xl shadow w-full h-full p-5 not-lg:pb-20 flex flex-col overflow-hidden">
					{children}
				</main>

				<div className="lg:hidden">
					<MobileSidebar />
				</div>
			</div>
		</WebSocketProvider>
	)
}

export default MainLayout
