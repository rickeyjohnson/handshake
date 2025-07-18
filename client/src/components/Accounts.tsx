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
	const [accountsData, setAccountsData] = useState<AccountComponentData[]>([
		{
			subtype: 'checking',
			icon: IconBuildingBank,
			total: 0,
		},
		{
			subtype: 'savings',
			icon: IconPigMoney,
			total: 0,
		},
		{
			subtype: 'credit card',
			icon: IconCreditCard,
			total: 0,
		},
		{
			subtype: 'investiment',
			icon: IconChartHistogram,
			total: 0,
		},
	])

	const calculateAccountsData = () => {
		accounts.map((acc) => {
			if (acc.subtype === 'checking') {
			}
		})
	}

	useEffect(() => {}, [])

	return (
		<div className="rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col">
			{accountsData.map((acc) => (
				<div className="flex gap-2 flex-row align-center">
					{<acc.icon size={20} />}
					<h1 className="self-center capitalize">{acc.subtype}</h1>
					<p>{`${formatCurrency(acc.total, true)}`}</p>
				</div>
			))}
		</div>
	)
}

export default Accounts
