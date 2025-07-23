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
import { categories } from '../constants/constants'
import { useAccount } from '../contexts/AccountContext'
import type { Transactions } from '../types/types'

const TransactionsPage = () => {
	const { transactions, setTransactions } = useTransactions()
	const { user } = useUser()
	const { socket } = useWebSocket()
	const { accounts } = useAccount()

	const defaultTransaction: Transactions = {
		id: '-1',
		user_id: '-1',
		user_name: '',
		account_id: '-1',
		account_name: '',
		bank_name: '',
		category: 'INCOME',
		date: new Date().toLocaleDateString('en-US'),
		authorized_date: new Date().toLocaleDateString('en-US'),
		amount: 0,
		transaction_name: '',
		currency_code: 'USD',
		is_removed: false,
		update_counter: 0,
	}

	const [openPopover, setOpenPopover] = useState(false)
	const [editingTxId, setEditingTxId] = useState<string | null>(null)
	const [editedTx, setEditedTx] = useState<Transactions>(defaultTransaction) // customize type if needed

	const startEditing = (tx: any) => {
		setEditingTxId(tx.id)
		setEditedTx(tx)
		setOpenPopover(false)
	}

	const cancelEditing = () => {
		setEditingTxId(null)
		setEditedTx(defaultTransaction)
	}

	const saveEdit = async () => {
		try {
			console.log(editedTx)
			const response = await fetch('/api/expenses/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ ...editedTx }),
			})

			if (!response.ok) {
				throw new Error('Failed to update transaction')
			}

			cancelEditing()

			await fetchTransactions()
		} catch (error) {
			console.error('Error saving edit:', error)
		}
	}

	const handleInputChange = (field: string, value: any) => {
		setEditedTx((prev: any) => ({ ...prev, [field]: value }))
	}

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
					// cancel edit mode first
					cancelEditing()

					// then refetch transactions
					fetchTransactions()
				}
			} catch (error) {
				console.error('Error handling WebSocket message:', error)
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
				{editingTxId ? (
					<div className="flex gap-4 self-start">
						<Button onClick={saveEdit}>Save</Button>
						<Button variant="ghost" onClick={cancelEditing}>
							Cancel
						</Button>
					</div>
				) : (
					<div className="relative">
						<Button
							className="flex gap-2 align-center items-center self-center"
							title={!openPopover ? 'Add Expense Button' : 'Cancel Expense Button'}
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
				)}
			</MainHeader>

			<div className="shadow rounded-xl border border-stone-200 w-full overflow-x-auto">
				<table className="w-full table-auto rounded-xl">
					<thead>
						<tr className="bg-stone-100 text-left *:py-2 *:font-medium">
							<th className="w-[20%] px-6">Category</th>
							<th className="w-[25%] px-6">Name</th>
							<th className="w-[10%] px-6">Date</th>
							<th className="w-[10%] px-6">Status</th>
							<th className="w-[10%] px-6">User</th>
							<th className="w-[10%] px-6">Account</th>
							<th className="w-[10%] text-right px-6">Amount</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx) => {
							const isEditing = editingTxId === tx.id
							return (
								<tr
									key={tx.id}
									className={`border-t border-stone-200 ${
										!isEditing && 'cursor-pencil'
									} *:py-2`}
									onClick={() =>
										!isEditing && startEditing(tx)
									}
								>
									{isEditing ? (
										<>
											<td className="px-6">
												<select
													value={
														editedTx.category || ''
													}
													onChange={(e) =>
														handleInputChange(
															'category',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full"
												>
													{categories.map((cat) => (
														<option
															key={cat.value}
															value={cat.value}
														>
															{cat.label}
														</option>
													))}
												</select>
											</td>
											<td className="px-6">
												<input
													type="text"
													value={
														editedTx.transaction_name ||
														''
													}
													onChange={(e) =>
														handleInputChange(
															'transaction_name',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full"
												/>
											</td>
											<td className="px-6">
												<input
													type="date"
													value={editedTx.date || ''}
													onChange={(e) =>
														handleInputChange(
															'date',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full"
												/>
											</td>
											<td className="px-6">
												<select
													value={
														editedTx.authorized_date
															? 'Posted'
															: 'Pending'
													}
													onChange={(e) =>
														handleInputChange(
															'authorized_date',
															e.target.value ===
																'Posted'
																? tx.date
																: null
														)
													}
													className="border rounded px-2 py-1 w-full"
												>
													<option value="Posted">
														Posted
													</option>
													<option value="Pending">
														Pending
													</option>
												</select>
											</td>
											<td className="px-6 capitalize">
												<input
													type="text"
													value={
														editedTx.user_name || ''
													}
													onChange={(e) =>
														handleInputChange(
															'user_name',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full"
												/>
											</td>
											<td className="px-6">
												<select
													value={
														editedTx.account_id ||
														''
													}
													onChange={(e) =>
														handleInputChange(
															'account_id',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full"
												>
													{accounts
														.filter(
															(acc) =>
																acc.user_id ===
																user?.id
														)
														.map((acc) => (
															<option
																key={acc.id}
																value={acc.id}
															>
																{
																	acc.account_name
																}{' '}
																-{' '}
																{acc.bank_name}
															</option>
														))}
												</select>
											</td>
											<td className="text-right px-6">
												<input
													min="0"
													type="number"
													value={
														editedTx.amount || ''
													}
													onChange={(e) =>
														handleInputChange(
															'amount',
															e.target.value
														)
													}
													className="border rounded px-2 py-1 w-full text-right"
												/>
											</td>
										</>
									) : (
										<>
											<td className="px-6">
												{formatCategory(tx.category)}
											</td>
											<td className="px-6">
												{tx.transaction_name}
											</td>
											<td className="px-6">
												{tx.authorized_date || tx.date}
											</td>
											<td className="px-6">
												{tx.authorized_date
													? 'Posted'
													: 'Pending'}
											</td>
											<td className="px-6 capitalize">
												{tx.user_name}
											</td>
											<td className="px-6">
												{tx.account_name}
											</td>
											<td className="text-right px-6">
												{formatCurrency(tx.amount)}
											</td>
										</>
									)}
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
