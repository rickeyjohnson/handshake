import { useTransactions } from '../contexts/TransactionsContext'
import { formatCurrency } from '../utils/utils'

const Transactions = () => {
	const { transactions } = useTransactions()
	
	return (
		<div>
			<h1 className="py-2">Transactions</h1>
			<div className="shadow overflow-hidden rounded-xl border border-stone-200 w-full overflow-x-auto lg:overflow-visible">
				<table className="bg-white w-full rounded-xl overflow-hidden">
					<thead>
						<tr className="text-left bg-stone-100">
							<th className="text-lg font-medium w-[20%] pl-6 py-3">
								Date
							</th>
							<th className="text-lg font-medium w-[30%] px-3 py-3">
								Name
							</th>
							<th className="text-lg font-medium w-[20%] px-3 py-3">
								User
							</th>
							<th className="text-lg font-medium w-[20%] px-3 py-3">
								Account
							</th>
							<th className="text-lg font-medium w-[10%] pr-6 py-3 text-right">
								Amount
							</th>
						</tr>
					</thead>

					<tbody>
						{transactions &&
							transactions.slice(0, 10).map((tx) => (
								<tr
									key={tx.id}
									className="border-t border-stone-200"
								>
									<td className="pl-6 py-3">
										{tx.authorized_date || tx.date}
									</td>
									<td className="px-3 py-3">
										{tx.transaction_name}
									</td>
									<td className="px-3 py-3 capitalize">
										{tx.user_name}
									</td>
									<td className="px-3 py-3 capitalize">
										{tx.account_name}
									</td>
									<td className="pr-6 py-3 text-right">
										{formatCurrency(tx.amount)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Transactions
