import { Input } from './ui/Input'
import { Button } from './ui/Button'
import React, { useState } from 'react'
import { Label } from './ui/Label'

const AddGoalsModal = ({
	partner,
	handleClose,
}: {
	partner: string
	handleClose: () => void
}) => {
	const [error, setError] = useState('')
	const defaultGoal = {
		title: '',
		deadline: '',
		target: '',
		description: '',
	}
	const [newGoalData, setNewGoalData] = useState(defaultGoal)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = e.target

		if (name === 'target') {
			value = value.replace(/[^0-9.]/g, '')

			const parts = value.split('.')
			if (parts.length > 2) {
				value = parts[0] + '.' + parts[1]
			}

			if (parts[1]?.length > 2) {
				value = parts[0] + '.' + parts[1].slice(0, 2)
			}
		}

		setNewGoalData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!newGoalData.target) {
			setError('Target money goal needed')
			return
		}

		if (!is_number(newGoalData.target)) {
			setError('Target amount must be a number')
			return
		}

		try {
			const response = await fetch('/api/goals/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(newGoalData),
			})

			const data = await response.json()

			if (response.ok) {
				handleClose()
			} else {
				console.error('Failed to create goal', data.error)
				setError(data.error)
			}
		} catch (err) {
			console.error('Network error. Please try again', err)
		}
	}

	const is_number = (str: string) => {
		if (!str) return true
		if (typeof str !== 'string') return false

		const parsed = parseFloat(str)
		return !isNaN(parsed) && isFinite(parsed) && String(parsed) === str
	}

	return (
		<div className="h-screen w-screen bg-stone-950/70 absolute top-0 left-0 flex justify-center items-center">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm p-8 gap-2 relative">
				<h1 className="text-xl font-semibold self-start capitalize">
					add new goal
				</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Add a new goal that will be shared between you and{' '}
					{partner ?? 'your partner'}.
				</p>

				<form
					className="flex flex-col"
					onSubmit={(e) => handleSubmit(e)}
				>
					<Label>Title</Label>
					<Input
						placeholder=""
						name="title"
						value={newGoalData.title}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Label>Target Date</Label>
					<Input
						type="date"
						name="deadline"
						value={newGoalData.deadline}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Label>Target Amount</Label>
					<Input
						name="target"
						value={`$${newGoalData.target}`}
						onChange={handleChange}
						className="mt-2 mb- text-center font-medium text-5xl w-full"
						required={true}
					/>

					<Label>Description</Label>
					<Input
						placeholder=""
						name="description"
						value={newGoalData.description}
						onChange={handleChange}
						className=""
						required={true}
					/>

					<Button onClick={() => {}} className="w-full" type="submit">
						Create
					</Button>
				</form>

				{error ? <p>{error}</p> : <></>}

				<Button
					variant="ghost"
					className="flex justify-center items-center w-10 h-10 absolute right-2 top-2"
					onClick={handleClose}
				>
					<span className="material-icons w-6">close</span>
				</Button>
			</div>
		</div>
	)
}

export default AddGoalsModal
