import React from 'react'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from './Button'

const AddExpenseForm = () => {
	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		throw new Error('Function not implemented.')
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
		throw new Error('Function not implemented.')
	}

	/* 
		"account_id": "mQ7lJKgWqAubJMZKyekXTMyPAWmnDVFgZ6zoz",
		"category": "GENERAL_MERCHANDISE",
		// "date": "2025-07-14",
		// "authorized_date": "2025-07-13",
		// "transaction_name": "FUN",
		"amount": 89.4,
		"currency_code": "USD",
	},
    */

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

	return (
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
					value={''}
					onChange={handleChange}
					className=""
					required={true}
				/>

				<Label>Date</Label>
				<Input
					placeholder=""
					name="date"
					value={''}
					onChange={handleChange}
					className=""
					required={true}
				/>

				<Label>Category</Label>
				<select
					value={''}
					onChange={handleChange}
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
					value={''}
					onChange={handleChange}
					className=""
					required={true}
				/>

				<Label>Currency</Label>
                <Input type='radio' name='currency' value={"USD"}></Input>

				<Label>Account</Label>
				<select
					value={""}
					onChange={handleChange}
				>
					{categories.map((cat) => (
						<option key={cat.value} value={cat.value}>
							{cat.label}
						</option>
					))}
				</select>

				<Button onClick={() => {}} className="w-full" type="submit">
					Submit
				</Button>
			</form>
		</div>
	)
}

export default AddExpenseForm
