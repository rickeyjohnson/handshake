import { useAccount } from '../contexts/AccountContext'
import { formatCurrency } from '../utils/utils'

const Balances = () => {
	const { accounts } = useAccount()
	return (
		<div className='w-full'>
			<h1 className="py-2">Account Balances</h1>
			<div className="shadow rounded-xl border-1 border-stone-200 py-6 px-8 flex flex-col w-full h-[calc(100%-40px)]">
				<h1 className="mb-2 p-1 text-xl border-b-2 border-stone-600">
					Balances
				</h1>
				{accounts.map((acc) => (
					<div className="flex gap-10 text-lg border-b-2 border-stone-200 p-4 items-center last:border-0">
						<p className="flex-1">{acc.bank_name}</p>
						<h1 className="flex-1 bg-stone-50 border-1 border-stone-300 text-center rounded-3xl h-fit w-fit text-wrap p-1 text-stone-700 capitalize justify-center">
							{acc.user_name}
						</h1>
						<p className="flex-2">{acc.account_name}</p>
						<p className="flex-2 font-medium text-right">
							{formatCurrency(acc.balances.available)}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Balances
