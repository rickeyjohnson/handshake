import { useAccount } from '../contexts/AccountContext'
import { formatCurrency } from '../utils/utils'

const Balances = () => {
	const { accounts } = useAccount()
	return (
		<div className="w-full">
			<h1 className="py-2">Account Balances</h1>
			<div className="shadow rounded-xl border border-stone-200 py-6 px-4 sm:px-6 md:px-8 flex flex-col w-full">
				<h1 className="mb-4 text-xl font-medium border-b-2 border-stone-600">
					Balances
				</h1>

				{accounts.map((acc) => (
					<div
						key={acc.id}
						className="flex flex-wrap md:flex-nowrap gap-4 text-base border-b border-stone-200 py-4 items-center last:border-0"
					>
						<p className="flex-1 min-w-0 truncate">{acc.bank_name}</p>

						<h1 className="flex-1 min-w-0 text-sm text-center bg-stone-50 border border-stone-300 rounded-3xl px-3 py-1 text-stone-700 capitalize">
							{acc.user_name}
						</h1>

						<p className="flex-[2] min-w-0 truncate">{acc.account_name}</p>

						<p className="flex-[2] min-w-0 font-medium text-right">
							{formatCurrency(acc.balances.available)}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Balances
