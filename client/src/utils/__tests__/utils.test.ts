import type { Transactions } from '../../types/types'
import {
	calculatBudgetSpendingBasedOffCategory,
	calculateSpendingData,
	calculateTotalSpending,
	formatCategory,
	formatCurrency,
	formatXAxis,
	getFirstDayOfMonth,
	getNetSpendingForDay,
	isDateInCurrentMonth,
	isSameDay,
	numify,
} from '../utils'

describe('Client Utils Function', () => {
	test('formatCurrency: positive number', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56')
	})

	test('formatCurrency: negative number', () => {
		expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
	})

	test('formatCurrency: rounded number', () => {
		expect(formatCurrency(1234.5678, true)).toBe('$1,235')
	})

	test('numify: valid string', () => {
		expect(numify('$1,234.56')).toBe(1234.56)
	})

	test('numify: invalid string', () => {
		expect(numify('invalid')).toBe(NaN)
	})

	test('formatCategory: valid category', () => {
		expect(formatCategory('foo_bar')).toBe('foo bar')
	})

	test('isDateInCurrentMonth: date in current month', () => {
		const now = new Date()
		const date = new Date(now.getFullYear(), now.getMonth(), 15)
		expect(isDateInCurrentMonth(date)).toBe(true)
	})

	test('isDateInCurrentMonth: date not in current month', () => {
		const now = new Date()
		const date = new Date(now.getFullYear(), now.getMonth() + 1, 15)
		expect(isDateInCurrentMonth(date)).toBe(false)
	})

	test('getFirstDayOfMonth: valid date', () => {
		const date = new Date(2022, 8, 15)
		expect(getFirstDayOfMonth(date).getTime()).toBe(
			new Date(2022, 8, 1).getTime()
		)
	})

	test('calculateTotalSpending: valid transactions', () => {
		const transactions = [
			{ authorized_date: '2022-09-01', amount: 100 },
			{ authorized_date: '2022-09-02', amount: 200 },
		]
		expect(calculateTotalSpending(transactions as Transactions[])).toBe(0)
	})
})
