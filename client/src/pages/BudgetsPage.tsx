import MainHeader from '../components/MainHeader'
import MainLayout from '../components/MainLayout'
import { useUser } from '../contexts/UserContext'
import { Button } from '../components/ui/Button'
import {
	IconCash,
	IconCirclePlusFilled,
	IconCoin,
	IconPigMoney,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { formatMoney } from '../utils/utils'
import { Input } from '../components/ui/Input'
import { useWebSocket } from '../contexts/WebsocketContext'
import type { Budget } from '../types/types'
import { categories } from '../constants/constants'

const BudgetsPage = () => {
	const { user } = useUser()
	const { socket } = useWebSocket()
	const [budgets, setBudgets] = useState<Budget[]>([])
	const [isAdding, setIsAdding] = useState<boolean>(false)
	const [selectedCategory, setSelectedCategory] = useState('FOOD_AND_DRINK')

	const defaultNewBudget = {
		id: '',
		category: 'FOOD_AND_DRINK',
		budgeted: 0,
		actual: 0,
	}

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
			await fetch('/api/budgets/', {
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

	useEffect(() => {
		fetchBudgets()
	}, [])

	useEffect(() => {
		if (!socket) return

		const handleNewGoal = (event: MessageEvent) => {
			console.log('getting message')
			try {
				const data = JSON.parse(event.data)

				if (data.type === 'new_budget') {
					fetchBudgets()
				}
			} catch (error) {
				console.log(error)
			}
		}

		socket.addEventListener('message', handleNewGoal)

		return () => socket.removeEventListener('message', handleNewGoal)
	}, [socket])

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
								!newBudget.category ||
								!newBudget.budgeted ||
								newBudget.budgeted < 0
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
