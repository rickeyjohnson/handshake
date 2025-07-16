import React, { useEffect, useState } from 'react'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useAccount } from '../contexts/AccountContext'
import type { Expense } from '../types/types'
import { categories } from '../constants/constants'
import { formatCurrency } from '../utils/utils'

const AddExpenseForm = ({
	selectedAmount,
	className,
}: {
	selectedAmount: string
	className?: string
}) => {
	const { accounts } = useAccount()
	const defaultNewExpense = {
		accountId: '-1',
		category: '',
		date: '',
		authorizedDate: '',
		amount: 0,
		name: '',
		currencyCode: 'USD',
	}
	const [newExpense, setNewExpense] = useState<Expense>(defaultNewExpense)
	const [rawAmount, setRawAmount] = useState<number>(0)
	const [displayAmount, setDisplayAmount] = useState<string>('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/expenses/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newExpense),
			})
		} catch (error) {
			console.error('Network error.')
		}
	}

	const handleNewExpenseChange = (key: string, value: string | number) => {
		if (key === 'amount' && typeof value === 'string') {
			const val = value.replace(/[^0-9.]/g, '')
			const parts = val.split('.')
			let sanitized = parts[0]
			if (parts.length > 1) {
				sanitized += '.' + parts[1].slice(0, 2)
			}

			const raw = Number(sanitized)
			value = raw
			setRawAmount(raw)
			setDisplayAmount(sanitized)
		}

		setNewExpense((prev) => ({ ...prev, [key]: value }))
	}

	const fetchAccounts = () => {
		
	}

	useEffect(() => {
		if (selectedAmount) {
			const num = Number(selectedAmount)
			setRawAmount(num)
			setDisplayAmount(formatCurrency(num))
			setNewExpense((prev) => ({ ...prev, amount: num }))
		}
	}, [selectedAmount])

	return (
		<>
			<div
				className={`bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm p-8 gap-2 relative ${className}`}
			>
				<h1 className="text-xl font-semibold self-start capitalize">
					Create New Expense
				</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Select the price from the receipt image, and/or fill out the
					rest of the form to add expense.
				</p>

				<form className="flex flex-col" onSubmit={handleSubmit}>
					<Label>Name</Label>
					<Input
						placeholder=""
						name="name"
						value={newExpense.name}
						onChange={(e) =>
							handleNewExpenseChange('name', e.target.value)
						}
						required={true}
					/>

					<Label>Date</Label>
					<Input
						type="date"
						name="deadline"
						value={newExpense.date}
						onChange={(e) =>
							handleNewExpenseChange('date', e.target.value)
						}
						required={true}
					/>

					<Label>Category</Label>
					<select
						value={newExpense.category}
						onChange={(e) =>
							handleNewExpenseChange('category', e.target.value)
						}
						className="border rounded-lg mb-5 p-2 border-gray-400 focus:outline-4 outline-gray-300"
					>
						{categories.map((cat) => (
							<option key={cat.value} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>

					<Label>Amount</Label>
					<Input
						placeholder=""
						name="amount"
						value={displayAmount}
						onChange={(e) =>
							handleNewExpenseChange('amount', e.target.value)
						}
						onFocus={() => setDisplayAmount(String(rawAmount))}
						onBlur={() =>
							setDisplayAmount(formatCurrency(rawAmount))
						}
						required={true}
						inputMode="decimal"
						pattern="^\d+(\.\d{0,2})?$"
					/>

					<Label htmlFor="currency">Currency</Label>
					<div className="flex items-center mb-4 mt-2 ml-7">
						<input
							checked
							readOnly={true}
							id="default-radio-1"
							type="radio"
							value=""
							name="default-radio"
							className="w-4 h-4 text-slate-950 accent-slate-950"
						/>
						<label
							htmlFor="default-radio-1"
							className="ms-2 text-sm font-medium text-slate-950"
						>
							USD
						</label>
					</div>

					<Label>Account</Label>
					<select
						value={newExpense.accountId}
						onChange={(e) =>
							handleNewExpenseChange('accountId', e.target.value)
						}
						className="border rounded-lg mb-5 p-2 border-gray-400 focus:outline-4 outline-gray-300"
					>
						{accounts.map((acc) => (
							<option key={acc.id} value={acc.id}>
								{acc.account_name} - {acc.bank_name}
							</option>
						))}
					</select>

					<Button className="w-full" type="submit">
						Submit
					</Button>
				</form>
			</div>
		</>
	)
}

export default AddExpenseForm
