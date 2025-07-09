import MainHeader from '../components/MainHeader'
import MainLayout from '../components/MainLayout'
import { useUser } from '../contexts/UserContext'
import { Button } from '../components/Button'
import {
	IconCash,
	IconCirclePlusFilled,
	IconCoin,
	IconPigMoney,
} from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { formatMoney } from '../utils/utils'
import { Input } from '../components/Input'

type Budget = {
	id: string
	category: string
	budgeted: number
	actual: number
}

const BudgetsPage = () => {
	const { user } = useUser()
	const [budgets, setBudgets] = useState<Budget[]>([])
	const [isAdding, setIsAdding] = useState<boolean>(false)
	const [selectedCategory, setSelectedCategory] = useState('FOOD_AND_DRINK')

	const defaultNewBudget = {
		id: '',
		category: 'FOOD_AND_DRINK',
		budgeted: 0,
		actual: 0,
	}

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

	const [newBudget, setNewBudget] = useState<Budget>(defaultNewBudget)
	const startAddBudget = () => {
		setNewBudget(defaultNewBudget)
		setIsAdding(true)
	}

	const handleNewBudgetChange = (key: string, value: string | number) => {
		setNewBudget((prev) => ({ ...prev, [key]: value }))
	}

	const saveNewBudget = async () => {
		try {
			const response = await fetch('/api/budgets/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: newBudget.category,
					budgeted: newBudget.budgeted,
				}),
			})

			setIsAdding(false)
			await fetchBudgets()
		} catch (error) {
			console.error(error)
		}
	}

	const cancelNewBudget = () => {
		setIsAdding(false)
		setNewBudget(defaultNewBudget)
	}
	const spendingBudget = budgets.reduce(
		(sum, budget) => sum + budget.budgeted,
		0
	)
	const currentSpending = budgets.reduce(
		(sum, budget) => sum + budget.actual,
		0
	)
	const remaining = spendingBudget - currentSpending

	const fetchBudgets = async () => {
		try {
			const response = await fetch('/api/budgets', {
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await response.json()
			setBudgets(data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchBudgets()
	}, [])

	return (
		<MainLayout>
			<MainHeader
				title={'Budget'}
				caption={`Create budgets with ${user?.partner?.name}`}
			>
				{!isAdding ? (
					<Button
						className="flex gap-2 align-center items-center self-center"
						onClick={startAddBudget}
					>
						<IconCirclePlusFilled size={18} />
						Create New Budget
					</Button>
				) : (
					<div className="flex gap-3 flex-row-reverse">
						<Button
							onClick={async () => {
								await saveNewBudget()
							}}
							className="flex gap-2 align-center items-center self-center"
							disabled={
								!newBudget.category || !newBudget.budgeted || newBudget.budgeted < 0
							}
						>
							Save
						</Button>

						<Button
							variant="ghost"
							className="flex gap-2 align-center items-center self-center"
							onClick={cancelNewBudget}
						>
							Cancel
						</Button>
					</div>
				)}
			</MainHeader>

			<div className="flex items-start justify-center gap-5">
				<table className="bg-amber-200 flex-3">
					<thead>
						<tr className="text-left bg-amber-300">
							<th className="text-lg font-medium w-sm p-1 pl-3">
								Category
							</th>
							<th className="text-lg font-medium w-xs">
								Budgeted
							</th>
							<th className="text-lg font-medium w-2xs">
								Actual
							</th>
							<th className="text-lg font-medium pr-3">
								Remaining
							</th>
						</tr>
					</thead>
					<tbody>
						{budgets.map((budget) => {
							return (
								<tr key={budget.id}>
									<td className="p-1 pl-3">
										{budget.category}
									</td>
									<td className="p-1">
										{formatMoney(budget.budgeted)}
									</td>
									<td className="p-1">
										{formatMoney(budget.actual)}
									</td>
									<td className="text-right pr-3">
										{formatMoney(
											budget.budgeted - budget.actual
										)}
									</td>
								</tr>
							)
						})}

						{isAdding && (
							<tr>
								<td className="p-1 pl-3">
									<select
										value={selectedCategory}
										onChange={(e) => {
											handleNewBudgetChange(
												'category',
												e.target.value
											)
											setSelectedCategory(e.target.value)
										}}
									>
										{categories.map((cat) => (
											<option
												key={cat.value}
												value={cat.value}
											>
												{cat.label}
											</option>
										))}
									</select>
								</td>
								<td className="p-1">
									<Input
										type="number"
										min={0}
										value={newBudget.budgeted}
										onChange={(e) =>
											handleNewBudgetChange(
												'budgeted',
												e.target.value
											)
										}
									/>
								</td>
								<td className="p-1">---</td>
								<td className="text-right pr-3">---</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className="flex-1 p-10 border-2 border-stone-100 rounded-lg shadow">
					<h1 className="text-7xl font-semibold my-2">
						{formatMoney(remaining, true)}
					</h1>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconCash size={18} />
							Spending Budget
						</p>
						<p className="font-medium text-lg text-right">
							{formatMoney(spendingBudget, true)}
						</p>
					</div>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconPigMoney size={18} />
							Current Spending
						</p>
						<p className="font-medium text-lg text-right">
							{formatMoney(currentSpending, true)}
						</p>
					</div>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconCoin size={18} />
							Remaining
						</p>
						<p className="font-medium text-lg text-right">
							{formatMoney(remaining, true)}
						</p>
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default BudgetsPage
