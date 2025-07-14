import React from 'react'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from './Button'

const AddExpenseForm = () => {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        throw new Error('Function not implemented.')
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        throw new Error('Function not implemented.')
    }

	return (
		<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm p-8 gap-2 relative">
				<h1 className="text-xl font-semibold self-start capitalize">
					Create New Expense
				</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Select the price from the receipt image, and/or fill out the rest of the form to add expense.
				</p>

				<form
					className="flex flex-col"
					onSubmit={handleSubmit}
				>
					<Label>Label</Label>
					<Input
						placeholder=""
						name="title"
						value={""}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Label>Label</Label>
					<Input
						placeholder=""
						name="..."
						value={""}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Label>Label</Label>
					<Input
						placeholder=""
						name="..."
						value={""}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Label>Label</Label>
					<Input
						placeholder=""
						name="..."
						value={""}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Button onClick={() => {}} className="w-full" type="submit">
						Submit
					</Button>
				</form>
			</div>
	)
}

export default AddExpenseForm
