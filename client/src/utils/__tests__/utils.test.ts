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

    test('calculateSpendingData: valid transactions', () => {
		const transactions = [
			{ authorized_date: '2022-09-01', amount: 100 },
			{ authorized_date: '2022-09-02', amount: 200 },
		]
		const expectedData = [
            { authorized_date: new Date('2022-09-01'), amount: 100 },
			{ authorized_date: new Date('2022-09-02'), amount: 300 },
        ]

		expect(calculateSpendingData(transactions as Transactions[])).toEqual(
			expectedData
		)
	})

	// test('getNetSpendingForDay: valid transactions', () => {
	// 	const transactions = [
	// 		{ authorized_date: '2022-09-01', amount: 100 },
	// 		{ authorized_date: '2022-09-01', amount: -50 },
	// 	]
	// 	const day = new Date(2022, 8, 1)
	// 	expect(getNetSpendingForDay(transactions as Transactions[], day)).toBe(
	// 		50
	// 	)
	// })

	test('formatXAxis: valid date', () => {
		const date = new Date(2022, 8, 15)
		expect(formatXAxis(date)).toBe('September 15')
	})

	// test('calculatBudgetSpendingBasedOffCategory: valid transactions', () => {
	// 	const transactions = [
	// 		{ category: 'foo', authorized_date: '2022-09-01', amount: 100 },
	// 		{ category: 'bar', authorized_date: '2022-09-02', amount: 200 },
	// 	]
	// 	expect(
	// 		calculatBudgetSpendingBasedOffCategory(
	// 			'foo',
	// 			transactions as Transactions[]
	// 		)
	// 	).toBe(100)
	// })

	it('returns true for two dates on the same day', () => {
		const date1 = new Date('2025-07-24T10:00:00')
		const date2 = new Date('2025-07-24T23:59:59')
		expect(isSameDay(date1, date2)).toBe(true)
	})

	it('returns false for two dates on different days', () => {
		const date1 = new Date('2025-07-24T23:59:59')
		const date2 = new Date('2025-07-25T00:00:00')
		expect(isSameDay(date1, date2)).toBe(false)
	})

	it('returns false for dates in different months', () => {
		const date1 = new Date('2025-07-24')
		const date2 = new Date('2025-08-24')
		expect(isSameDay(date1, date2)).toBe(false)
	})

	it('returns false for dates in different years', () => {
		const date1 = new Date('2024-07-24')
		const date2 = new Date('2025-07-24')
		expect(isSameDay(date1, date2)).toBe(false)
	})
})
