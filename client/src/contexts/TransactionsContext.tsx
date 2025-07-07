import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react'

type Transactions = {
	id: string | number
	user_id: string
	user_name: string
	account_id: string
	account_name: string
	bank_name: string
	category: string
	date: string
	authorized_date: string
	transaction_name: string
	amount: number
	currency_code: string
	is_removed: boolean
}

type TransactionsContextType = {
	transactions: Transactions[]
	setTransactions: Dispatch<SetStateAction<Transactions[]>>
}

const defaultTransactions: TransactionsContextType = {
	transactions: [],
	setTransactions: () => {},
}

export const TransactionsContext =
	createContext<TransactionsContextType>(defaultTransactions)

export const TransactionProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [transactions, setTransactions] = useState<Transactions[]>([])

	return (
		<TransactionsContext.Provider value={{ transactions, setTransactions }}>
			{children}
		</TransactionsContext.Provider>
	)
}

export const useTransactions = () => useContext(TransactionsContext)
