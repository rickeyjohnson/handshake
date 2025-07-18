import type { Icon } from '@tabler/icons-react'
import type { Dispatch, SetStateAction } from 'react'

export type OCRBBox = {
	x0: number
	y0: number
	x1: number
	y1: number
}

export type OCRNode = {
	text?: string
	bbox?: OCRBBox
	symbols?: OCRNode[]
	words?: OCRNode[]
	lines?: OCRNode[]
	paragraphs?: OCRNode[]
}

export type OCRResult = {
	text: string
	bbox: OCRBBox
	selected: boolean
	hovered: boolean
}

export type Expense = {
	accountId: string
	category: string
	date: string
	authorizedDate: string
	amount: number
	name: string
	currencyCode: string
}

export type navItem = {
	title: string
	url: string
	icon: Icon
}

export type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode
	variant?: string
	className?: string
}

export type InputType = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string
	variant?: string
}

export type LabelType = React.LabelHTMLAttributes<HTMLLabelElement> & {
	children?: React.ReactNode
	className?: string
}

export type Account = {
	id: string
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

export type AccountContextType = {
	accounts: Account[]
	setAccounts: Dispatch<SetStateAction<Account[]>>
}

export type Transactions = {
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

export type TransactionsContextType = {
	transactions: Transactions[]
	setTransactions: Dispatch<SetStateAction<Transactions[]>>
}

export type UserContextType = {
	user: User | null
	loading: boolean
	setUser: Dispatch<SetStateAction<User | null>>
}

export type WebSocketContextType = {
	socket: WebSocket | null
}

export type Budget = {
	id: string
	category: string
	budgeted: number
	actual: number
}

export type User = {
	id: string
	name: string
	email: string
	is_plaid_linked: boolean
	is_paired: boolean
	partner: {
		name: string
		id: string
	}
}

export type GoalContributions = {
	id: string
	goal_id: string
	user_id: string
	user: User
	name?: string
	amount: number
	created_at: Date
}

export type GoalType = {
	id: string
	user_id: string
	user: User | null
	pair_id: string
	title: string
	description: string | null
	target: number
	current: number
	deadline?: Date | null
	created_at: Date
	updated_at: Date
	contributions: GoalContributions[]
}

export type Category = {
	label: string
	value: string
}

export type Notification = {
	action: 'ADD' | 'UPDATE' | 'DELETE'
	object: 'expense' | 'goal' | 'budget'
	user_id: string
	pair_id: string
	content: string | number | boolean | null
}

export type SpendingData = {
	date: Date
	total: number
}

export type DashboardData = {
	netWorth: number
	userNetWorth: number
	partnerNetWorth: number
	spending: number
	spending_data: SpendingData[]
}
