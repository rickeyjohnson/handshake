import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react'

type Account = {
	id: string | number
	account_name: string
	bank_name: string
	user_id: string
	balances: {
		available: number
		current: number
		currency_code: string
	}
	subtype: string
	type: string
}

type AccountContextType = {
	accounts: Account[]
	setAccounts: Dispatch<SetStateAction<Account[]>>
}

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
