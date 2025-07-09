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
import { useState } from 'react'

type Budget = {
	id: string
	pair_id: string
	category: string
	budgeted: number
	actual: number
	created_at: Date
}

const BudgetsPage = () => {
	const { user } = useUser()
	const [budgets, setBudgets] = useState<Budget[]>([])

	return (
		<MainLayout>
			<MainHeader
				title={'Budget'}
				caption={`Create budgets with ${user?.partner?.name}`}
			>
				<Button className="flex gap-2 align-center items-center self-center">
					<IconCirclePlusFilled size={18} />
					Create New Budget
				</Button>
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
								<tr>
									<td className="p-1 pl-3">
										{budget.category}
									</td>
									<td className="p-1">{budget.budgeted}</td>
									<td className="p-1">{budget.actual}</td>
									<td className="text-right pr-3">
										{budget.budgeted - budget.actual}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				<div className="flex-1 p-10 border-2 border-stone-100 rounded-lg shadow">
					<h1 className="text-7xl font-semibold my-2">$300</h1>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconCash size={18} />
							Spending Budget
						</p>
						<p className="font-medium text-lg text-right">${
								budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
							}</p>
					</div>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconPigMoney size={18} />
							Current Spending
						</p>
						<p className="font-medium text-lg text-right">$200</p>
					</div>

					<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
						<p className="flex grow items-center gap-2 font-normal text-lg">
							<IconCoin size={18} />
							Remaining
						</p>
						<p className="font-medium text-lg text-right">$0</p>
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default BudgetsPage
