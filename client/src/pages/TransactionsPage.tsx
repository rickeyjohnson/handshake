import { useEffect } from 'react'
import MainLayout from '../components/MainLayout'
import { useTransactions } from '../contexts/TransactionsContext'
import { formatMoney } from '../utils/utils'

const TransactionsPage = () => {
	const { transactions, setTransactions } = useTransactions()

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
								<td className="p-1">
									{tx.transaction_name}
								</td>
								<td className="p-1">
									{tx.authorized_date || tx.date}
								</td>
								<td className="p-1">
									{tx.authorized_date ? 'Posted' : 'Pending'}
								</td>
								<td className="p-1 capitalize">
									{tx.user_name}
								</td>
								<td className="p-1">
									{tx.account_name}
								</td>
								<td className="text-right pr-3">
									{formatMoney(tx.amount)}
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
