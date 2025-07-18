import { IconBuildingBank } from '@tabler/icons-react'
import { useAccount } from '../contexts/AccountContext'
import { useEffect, useState } from 'react'
import type { AccountComponentData } from '../types/types'

const Accounts = () => {
	const { accounts } = useAccount()
	const [accountsData, setAccountsData] = useState<AccountComponentData[]>([])

	useEffect(() => {
		setAccountsData([])
	}, [])

	return (
		<div className="rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col">
			{accountsData.map((acc) => (
				<div className="flex gap-2 flex-row align-center">
					<IconBuildingBank size={20} />
					<h1 className="self-center">Checking</h1>
					<p>${`${acc}`}</p>
				</div>
			))}
		</div>
	)
}

export default Accounts
