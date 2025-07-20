import {
	IconDashboard,
	IconMoneybag,
	IconTable,
	IconTargetArrow,
} from '@tabler/icons-react'
import type { Category, navItem } from '../types/types'

export const categories: Category[] = [
	{ label: 'INCOME', value: 'INCOME' },
	{ label: 'TRANSFER IN', value: 'TRANSFER_IN' },
	{ label: 'TRANSFER OUT', value: 'TRANSFER_OUT' },
	{ label: 'LOAN PAYMENTS', value: 'LOAN_PAYMENTS' },
	{ label: 'BANK FEES', value: 'BANK_FEES' },
	{ label: 'ENTERTAINMENT', value: 'ENTERTAINMENT' },
	{ label: 'FOOD AND DRINK', value: 'FOOD_AND_DRINK' },
	{ label: 'GENERAL MERCHANDISE', value: 'GENERAL_MERCHANDISE' },
	{ label: 'HOME IMPROVEMENT', value: 'HOME_IMPROVEMENT' },
	{ label: 'MEDICAL', value: 'MEDICAL' },
	{ label: 'PERSONAL CARE', value: 'PERSONAL_CARE' },
	{ label: 'GENERAL SERVICES', value: 'GENERAL_SERVICES' },
	{
		label: 'GOVERNMENT AND NON PROFIT',
		value: 'GOVERNMENT_AND_NON_PROFIT',
	},
	{ label: 'TRANSPORTATION', value: 'TRANSPORTATION' },
	{ label: 'TRAVEL', value: 'TRAVEL' },
	{ label: 'RENT AND UTILITIES', value: 'RENT_AND_UTILITIES' },
]

export const nav: navItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: IconDashboard,
	},
	{
		title: 'Transactions',
		url: '/transactions',
		icon: IconTable,
	},
	{
		title: 'Budget',
		url: '/budgets',
		icon: IconMoneybag,
	},
	{
		title: 'Goals',
		url: '/goals',
		icon: IconTargetArrow,
	},
]
