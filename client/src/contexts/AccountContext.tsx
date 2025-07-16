import { createContext, useContext, useState } from 'react'
import type { Account, AccountContextType } from '../types/types'

const defaultAccountContextType: AccountContextType = {
	accounts: [],
	setAccounts: () => {},
}

export const AccountContext = createContext<AccountContextType>(
	defaultAccountContextType
)

export const AccountProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [accounts, setAccounts] = useState<Account[]>([])

	return (
		<AccountContext.Provider value={{ accounts, setAccounts }}>
			{children}
		</AccountContext.Provider>
	)
}

export const useAccount = () => useContext(AccountContext)
