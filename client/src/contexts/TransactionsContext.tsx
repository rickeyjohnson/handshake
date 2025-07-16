import { createContext, useContext, useState } from 'react'
import type { Transactions, TransactionsContextType } from '../types/types'

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
