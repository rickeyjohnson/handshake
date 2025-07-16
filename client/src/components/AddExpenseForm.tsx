import React, { useEffect, useState } from 'react'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from './Button'
import { useAccount } from '../contexts/AccountContext'

type Expense = {
	accountId: string
	category: string
	date: string
	authorizedDate: string
	amount: number
	name: string
	currencyCode: string
}

const AddExpenseForm = ({ selectedAmount }: { selectedAmount: string }) => {
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
	const categories = [
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

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		throw new Error('Function not implemented.')
	}

	const handleNewExpenseChange = (key: string, value: string | number) => {
		setNewExpense((prev) => ({ ...prev, [key]: value }))
	}

	useEffect(() => {
		handleNewExpenseChange('amount', selectedAmount)
	}, [selectedAmount])

	return (
		<>
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm p-8 gap-2 relative">
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
						placeholder="MM/DD/YYYY"
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
						value={newExpense.amount}
						onChange={(e) =>
							handleNewExpenseChange('amount', e.target.value)
						}
						className=""
						required={true}
					/>

					<Label htmlFor="currency">Currency</Label>
					<div className="flex items-center mb-4 mt-1 justify-center">
						<input
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

					<Button onClick={() => {}} className="w-full" type="submit">
						Submit
					</Button>
				</form>
			</div>
		</>
	)
}

export default AddExpenseForm
