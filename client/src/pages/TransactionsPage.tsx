import { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { useTransactions } from '../contexts/TransactionsContext'
import { formatCurrency } from '../utils/utils'
import MainHeader from '../components/layout/MainHeader'
import { useUser } from '../contexts/UserContext'
import { Button } from '../components/ui/Button'
import { IconCirclePlusFilled, IconX } from '@tabler/icons-react'
import AddExpensePopover from '../components/AddExpensePopover'

const TransactionsPage = () => {
	const { transactions, setTransactions } = useTransactions()
	const { user } = useUser()
	const [openPopover, setOpenPopover] = useState(false)

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
		syncTransactions()
		fetchTransactions()
	}, [])

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
			<table className="bg-amber-200 flex-3">
				<thead>
					<tr className="text-left bg-amber-300">
						<th className="text-lg font-medium w-sm p-1 pl-3">
							Category
						</th>
						<th className="text-lg font-medium w-md">Name</th>
						<th className="text-lg font-medium w-3xs">Date</th>
						<th className="text-lg font-medium w-2xs">Status</th>
						<th className="text-lg font-medium w-2xs">User</th>
						<th className="text-lg font-medium w-sm">Account</th>
						<th className="text-lg font-medium pr-3">Amount</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((tx) => {
						return (
							<tr key={tx.id}>
								<td className="p-1 pl-3">{tx.category}</td>
								<td className="p-1">{tx.transaction_name}</td>
								<td className="p-1">
									{tx.authorized_date || tx.date}
								</td>
								<td className="p-1">
									{tx.authorized_date ? 'Posted' : 'Pending'}
								</td>
								<td className="p-1 capitalize">
									{tx.user_name}
								</td>
								<td className="p-1">{tx.account_name}</td>
								<td className="text-right pr-3">
									{formatCurrency(tx.amount)}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</MainLayout>
	)
}

export default TransactionsPage
