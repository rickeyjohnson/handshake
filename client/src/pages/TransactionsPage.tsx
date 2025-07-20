import { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { useTransactions } from '../contexts/TransactionsContext'
import { formatCategory, formatCurrency } from '../utils/utils'
import MainHeader from '../components/layout/MainHeader'
import { useUser } from '../contexts/UserContext'
import { Button } from '../components/ui/Button'
import { IconCirclePlusFilled, IconX } from '@tabler/icons-react'
import AddExpensePopover from '../components/AddExpensePopover'
import { useWebSocket } from '../contexts/WebsocketContext'

const TransactionsPage = () => {
	const { transactions, setTransactions } = useTransactions()
	const { user } = useUser()
	const { socket } = useWebSocket()
	const [openPopover, setOpenPopover] = useState(false)

	const fetchTransactions = async () => {
		try {
			syncTransactions()
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
		fetchTransactions()
	}, [])

	useEffect(() => {
		if (!socket) return

		const handleNewExpense = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)

				if (data.object === 'expense') {
					fetchTransactions()
				}
			} catch (error) {
				console.log(error)
			}
		}

		socket.addEventListener('message', handleNewExpense)

		return () => socket.removeEventListener('message', handleNewExpense)
	}, [socket])

	return (
		<MainLayout>
			<MainHeader
				title="Transactions"
				caption={`View all yours and ${
					user?.partner?.name ?? 'partner'
				}'s transaction history.`}
			>
				<div className="relative">
					<Button
						className="flex gap-2 align-center items-center self-center"
						onClick={() => setOpenPopover(!openPopover)}
					>
						{!openPopover ? (
							<>
								<IconCirclePlusFilled size={18} />
								Add Expense
							</>
						) : (
							<>
								<IconX size={18} />
								Cancel
							</>
						)}
					</Button>

					{openPopover && <AddExpensePopover />}
				</div>
			</MainHeader>
			<div className='shadow overflow-hidden rounded-xl border border-stone-200'>
				<table className="flex-3 bg-white w-full rounded-xl overflow-hidden">
					<thead>
						<tr className="text-left bg-stone-100 *:py-3">
							<th className="text-lg font-medium w-sm pl-6">
								Category
							</th>
							<th className="text-lg font-medium w-md">Name</th>
							<th className="text-lg font-medium w-3xs">Date</th>
							<th className="text-lg font-medium w-2xs">Status</th>
							<th className="text-lg font-medium w-2xs">User</th>
							<th className="text-lg font-medium w-sm">Account</th>
							<th className="text-lg font-medium pr-6">Amount</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx) => {
							return (
								<tr key={tx.id} className='border-t border-stone-200 *:py-3'>
									<td className="pl-6">{formatCategory(tx.category)}</td>
									<td className="">{tx.transaction_name}</td>
									<td className="">
										{tx.authorized_date || tx.date}
									</td>
									<td className="">
										{tx.authorized_date ? 'Posted' : 'Pending'}
									</td>
									<td className="capitalize">
										{tx.user_name}
									</td>
									<td className="">{tx.account_name}</td>
									<td className="text-right pr-6">
										{formatCurrency(tx.amount)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</MainLayout>
	)
}

export default TransactionsPage
