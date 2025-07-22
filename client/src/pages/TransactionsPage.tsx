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
				credentials: 'include',
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
				credentials: 'include',
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
			<div className="shadow rounded-xl border border-stone-200 w-full overflow-x-auto">
				<table className="flex-3 bg-white w-full table-auto rounded-xl px-4 sm:px-6 md:px-8">
					<thead>
						<tr className="text-left bg-stone-100 *:py-2">
							<th className="text-lg font-medium w-[20%] px-2 sm:px-6 pl-6">
								Category
							</th>
							<th className="text-lg font-medium w-[25%] px-2 sm:px-6">
								Name
							</th>
							<th className="text-lg font-medium w-[10%] px-2 sm:px-6">
								Date
							</th>
							<th className="text-lg font-medium w-[10%] px-2 sm:px-6">
								Status
							</th>
							<th className="text-lg font-medium w-[10%] px-2 sm:px-6">
								User
							</th>
							<th className="text-lg font-medium w-[10%] px-2 sm:px-6">
								Account
							</th>
							<th className="text-lg text-right font-medium w-[10%] pr-6 px-2 sm:px-6">
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx) => {
							return (
								<tr
									key={tx.id}
									className="border-t border-stone-200 *:py-3"
								>
									<td className="px-2 sm:px-6 pl-6">
										{formatCategory(tx.category)}
									</td>
									<td className="px-2 sm:px-6">
										{tx.transaction_name}
									</td>
									<td className="px-2 sm:px-6">
										{tx.authorized_date || tx.date}
									</td>
									<td className="px-2 sm:px-6">
										{tx.authorized_date
											? 'Posted'
											: 'Pending'}
									</td>
									<td className="px-2 sm:px-6 capitalize">
										{tx.user_name}
									</td>
									<td className="px-2 sm:px-6">
										{tx.account_name}
									</td>
									<td className="text-right pr-6 px-2 sm:px-6">
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
