import MainHeader from '../components/layout/MainHeader'
import MainLayout from '../components/layout/MainLayout'
import { useUser } from '../contexts/UserContext'
import { Button } from '../components/ui/Button'
import {
	IconCash,
	IconCirclePlusFilled,
	IconCoin,
	IconPigMoney,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import {
	calculatBudgetSpendingBasedOffCategory,
	formatCategory,
	formatCurrency,
} from '../utils/utils'
import { Input } from '../components/ui/Input'
import { useWebSocket } from '../contexts/WebsocketContext'
import type { Budget } from '../types/types'
import { categories } from '../constants/constants'
import { useTransactions } from '../contexts/TransactionsContext'

const BudgetsPage = () => {
	const { user } = useUser()
	const { socket } = useWebSocket()
	const { transactions } = useTransactions()
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
		if (!socket) return

		const handleNewBudget = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)

				if (data.object === 'budget') {
					fetchBudgets()
				}
			} catch (error) {
				console.log(error)
			}
		}

		socket.addEventListener('message', handleNewBudget)

		return () => socket.removeEventListener('message', handleNewBudget)
	}, [socket])

	return (
		<MainLayout>
			<MainHeader
				title={'Budget'}
				caption={`Create budgets with ${user?.partner?.name}`}
			>
				{!isAdding ? (
					<Button
						className="flex gap-2 align-center items-center h-fit"
						onClick={startAddBudget}
					>
						<IconCirclePlusFilled size={18} />
						Create New Budget
					</Button>
				) : (
					<div className='relative'>
						<Button
							onClick={async () => {
								await saveNewBudget()
							}}
							className="flex gap-2 align-center items-center h-fit"
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

			<div className="flex flex-wrap items-start justify-center gap-5">
				<div className="shadow overflow-hidden rounded-xl border border-stone-200 w-full overflow-x-auto">
					<table className="flex-3 bg-white rounded-xl w-full">
						<thead>
							<tr className="text-left bg-stone-100 *:py-3">
								<th className="text-lg font-medium w-sm p-1 pl-6 px-3">
									Category
								</th>
								<th className="text-lg font-medium w-xs px-3">
									Budgeted
								</th>
								<th className="text-lg font-medium w-2xs px-3">
									Actual
								</th>
								<th className="text-lg font-medium pr-6 px-3">
									Remaining
								</th>
							</tr>
						</thead>
						<tbody>
							{budgets.map((budget) => {
								const actual =
									calculatBudgetSpendingBasedOffCategory(
										budget.category,
										transactions
									)
								const remaining = budget.budgeted - actual
								return (
									<tr
										key={budget.id}
										className="border-t border-stone-200 *:py-3"
									>
										<td className="p-1 pl-6 px-3">
											{formatCategory(budget.category)}
										</td>
										<td className="p-1 px-3">
											{formatCurrency(budget.budgeted)}
										</td>
										<td className="p-1 px-3">
											{formatCurrency(actual)}
										</td>
										<td
											className={`text-right pr-6 px-3 ${
												remaining < 0
													? 'text-red-600'
													: 'text-lime-700'
											}`}
										>
											{formatCurrency(remaining)}
										</td>
									</tr>
								)
							})}

							{isAdding && (
								<tr className="border-t border-stone-200">
									<td className="p-1 pl-6 px-3">
										<select
											value={selectedCategory}
											onChange={(e) => {
												handleNewBudgetChange(
													'category',
													e.target.value
												)
												setSelectedCategory(
													e.target.value
												)
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
									<td className="p-1 px-3">
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
									<td className="p-1 px-3">---</td>
									<td className="text-right pr-6 px-3">---</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="flex-1 p-10 border-2 border-stone-100 rounded-lg shadow">
					<h1 className="text-7xl font-medium py-7">
						{formatCurrency(remaining, true)}
					</h1>

					<div className="*:p-4">
						<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
							<p className="flex grow items-center gap-2 font-normal text-lg">
								<IconCash size={18} />
								Spending Budget
							</p>
							<p className="font-medium text-lg text-right">
								{formatCurrency(spendingBudget, true)}
							</p>
						</div>

						<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
							<p className="flex grow items-center gap-2 font-normal text-lg">
								<IconPigMoney size={18} />
								Current Spending
							</p>
							<p className="font-medium text-lg text-right">
								{formatCurrency(currentSpending, true)}
							</p>
						</div>

						<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
							<p className="flex grow items-center gap-2 font-normal text-lg">
								<IconCoin size={18} />
								Remaining
							</p>
							<p className="font-medium text-lg text-right">
								{formatCurrency(remaining, true)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default BudgetsPage
