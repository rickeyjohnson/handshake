import {
	IconBuildingBank,
	IconChartHistogram,
	IconCreditCard,
	IconPigMoney,
} from '@tabler/icons-react'
import { useAccount } from '../contexts/AccountContext'
import { useEffect, useState } from 'react'
import type { AccountComponentData } from '../types/types'
import { formatCurrency } from '../utils/utils'

const Accounts = () => {
	const { accounts } = useAccount()
	const [accountsData, setAccountsData] = useState<AccountComponentData[]>([])

	const getAccountBalanceTotal = (type: string) => {
		let total = 0
		for (const acc of accounts) {
			if (acc.subtype === type || acc.type === type) {
				total += acc.balances.available
			}
		}

		return total
	}

	useEffect(() => {
		setAccountsData([
			{
				subtype: 'checking',
				icon: IconBuildingBank,
				total: getAccountBalanceTotal('checking'),
			},
			{
				subtype: 'credit card',
				icon: IconCreditCard,
				total: getAccountBalanceTotal('credit card'),
			},
			{
				subtype: 'savings',
				icon: IconPigMoney,
				total: getAccountBalanceTotal('savings'),
			},
			{
				subtype: 'investiment',
				icon: IconChartHistogram,
				total: 0,
			},
		])
	}, [accounts])

	return (
		<div>
			<h1 className="py-2">Accounts Summary</h1>
			<div className="rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col text-lg">
				{accountsData.map((acc) => (
					<div className="flex gap-3 flex-row align-center border-b-2 border-stone-200 p-4 last:border-0">
						{<acc.icon size={24} />}
						<h1 className="self-center capitalize">
							{acc.subtype}
						</h1>
						<p className="flex-1 text-right w-25 font-medium">{`${formatCurrency(
							acc.total,
							true
						)}`}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Accounts
