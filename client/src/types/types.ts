import type { Icon } from "@tabler/icons-react"
import type { Dispatch, SetStateAction } from "react"

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

export type AccountContextType = {
    accounts: Account[]
    setAccounts: Dispatch<SetStateAction<Account[]>>
}