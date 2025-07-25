import type { SpendingData, Transactions } from '../types/types'

export const formatCurrency = (amount: number, round: boolean = false) => {
	const value = round ? Math.round(amount) : amount

	const formatted = Math.abs(value).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: round ? 0 : 2,
		maximumFractionDigits: round ? 0 : 2,
	})

	return value < 0 ? `-${formatted}` : formatted
}

export const isSameDay = (first: Date, second: Date) => {
	return (
		first.getUTCFullYear() === second.getUTCFullYear() &&
		first.getUTCMonth() === second.getUTCMonth() &&
		first.getUTCDate() === second.getUTCDate()
	)
}

export const numify = (str: string) => {
	const value = str.split('$').join('')
	const removedCommas = value.split(',').join('')
	const parts = removedCommas.split('.')
	let sanitized = parts[0]
	if (parts.length > 1) {
		sanitized += '.' + parts[1].slice(0, 2)
	}

	return Number(sanitized)
}

export const formatCategory = (cat: string) => {
	return cat.split('_').join(' ')
}

export const isDateInCurrentMonth = (date: Date) => {
	const now = new Date()
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth()
	)
}

export const getFirstDayOfMonth = (date: Date) => {
	return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const calculateTotalSpending = (transactions: Transactions[]) => {
	return transactions.reduce((sum, tx) => {
		if (
			isDateInCurrentMonth(new Date(tx.authorized_date)) &&
			tx.amount > 0
		) {
			return sum + tx.amount
		}

		return sum
	}, 0)
}

export const calculateSpendingData = (transactions: Transactions[]) => {
	const cumulativeData: SpendingData[] = [
		{ date: getFirstDayOfMonth(new Date()), total: 0 },
	]
	const filterTransactions = transactions.filter(
		(tx) =>
			isDateInCurrentMonth(new Date(tx.authorized_date)) && tx.amount > 0
	)
	filterTransactions.sort(
		(a, b) =>
			new Date(a.authorized_date).getTime() -
			new Date(b.authorized_date).getTime()
	)
	let runningTotal = 0
	for (const tx of filterTransactions) {
		runningTotal += tx.amount

		if (
			cumulativeData[cumulativeData.length - 1].date.getTime() ===
			new Date(tx.authorized_date).getTime()
		) {
			cumulativeData[cumulativeData.length - 1].total = runningTotal
		} else {
			cumulativeData.push({
				date: new Date(tx.authorized_date),
				total: runningTotal,
			})
		}
	}

	return cumulativeData
}

export const getNetSpendingForDay = (
	transactions: Transactions[],
	day: Date
) => {
	const filteredTransactions = transactions.filter((tx) => {
		return isSameDay(new Date(tx.authorized_date), day)
	})
	return filteredTransactions.reduce((sum, tx) => sum - tx.amount, 0)
}

export const formatYAxis = (val: string) => `$${val}`

export const formatXAxis = (date: Date | string) => {
	if (typeof date === 'string') {
		date = new Date(date)
	}

	return `${date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
	})}`
}

export const calculatBudgetSpendingBasedOffCategory = (
	category: string,
	transactions: Transactions[]
) => {
	const filterTransactions = transactions.filter(
		(tx) =>
			category === tx.category &&
			isDateInCurrentMonth(new Date(tx.authorized_date)) &&
			tx.amount > 0
	)
	return filterTransactions.reduce((sum, tx) => sum + tx.amount, 0)
}
