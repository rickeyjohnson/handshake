import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import MainLayout from '../components/layout/MainLayout'
import MainHeader from '../components/layout/MainHeader'
import { IconCalendarEvent, IconTargetArrow } from '@tabler/icons-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { GoalType } from '../types/types'
import { formatCurrency } from '../utils/utils'

const GoalDetailsPage = () => {
	const { id } = useParams()
	const defaultGoal = {
		id: '',
		user_id: '',
		user: null,
		pair_id: '',
		title: '',
		description: '',
		target: 0,
		current: 0,
		deadline: new Date(),
		created_at: new Date(),
		updated_at: new Date(),
		contributions: [],
	}
	const [goal, setGoal] = useState<GoalType>(defaultGoal)

	const TEST_GOAL_CONTRIBUTIONS = [
		{
			id: 'gc1',
			goal_id: 'g1',
			user_id: 'u1',
			user: {
				id: 'u1',
				name: 'Alice Smith',
				email: 'alice@example.com',
			},
			amount: 100,
			created_at: '2023-10-01T10:00:00Z',
		},
		{
			id: 'gc2',
			goal_id: 'g1',
			user_id: 'u2',
			user: {
				id: 'u2',
				name: 'Bob Johnson',
				email: 'bob@example.com',
			},
			amount: 30,
			created_at: '2023-10-02T11:30:00Z',
		},
		{
			id: 'gc3',
			goal_id: 'g2',
			user_id: 'u3',
			user: {
				id: 'u3',
				name: 'Charlie Brown',
				email: 'charlie@example.com',
			},
			amount: 200,
			created_at: '2023-10-03T09:15:00Z',
		},
		{
			id: 'gc4',
			goal_id: 'g2',
			user_id: 'u4',
			user: {
				id: 'u4',
				name: 'Dana White',
				email: 'dana@example.com',
			},
			amount: 304,
			created_at: '2023-10-04T14:45:00Z',
		},
		{
			id: 'gc5',
			goal_id: 'g3',
			user_id: 'u5',
			user: {
				id: 'u5',
				name: 'Eli Green',
				email: 'eli@example.com',
			},
			amount: 300,
			created_at: '2023-10-05T16:20:00Z',
		},
	]

	const contributions = TEST_GOAL_CONTRIBUTIONS

	const fetchGoal = async () => {
		try {
			const response = await fetch(`/api/goals/details/${id}`)
			const data = await response.json()

			setGoal(data)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchGoal()
	}, [])

	return (
		<MainLayout>
			<MainHeader
				title={`Goal: ${goal.title}`}
				caption={`Created by ${goal.user?.name} at ${new Date(
					goal.created_at
				).toDateString()}`}
			></MainHeader>

			<div className="mx-4">
				<div className="flex items-stretch mb-4 gap-5">
					<div className="flex flex-1 flex-col gap-2 box-border border-2 border-stone-100 shadow rounded-xl w-[50%] h-auto p-5">
						<h1 className="text-7xl font-semibold my-2">
							${goal.current}
						</h1>
						<div className="flex gap-2 items-center border-t-2 p-2 pb-0 border-stone-200">
							<p className="flex grow items-center gap-2 font-normal text-lg">
								<IconTargetArrow size={18} />
								Total Goal
							</p>
							<p className="font-medium text-lg text-right">
								${goal.target}
							</p>
						</div>
						{goal.deadline && (
							<div className="flex gap-2 items-center border-y-2 p-2 border-stone-200">
								<p className="flex grow items-center gap-2 font-normal text-lg">
									<IconCalendarEvent size={18} />
									Target Completion Date
								</p>
								<p className="font-medium text-lg text-right">
									{new Date(goal.deadline).toDateString()}
								</p>
							</div>
						)}
					</div>
					<div className="flex flex-1 flex-col gap-2 box-border border-2 border-stone-100 shadow rounded-xl w-[50%] p-5">
						<h1>Contribution Chart</h1>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={contributions}>
								<YAxis />
								<XAxis />
								<Line
									type="monotone"
									dataKey="amount"
									dot={false}
									stroke="black"
									strokeWidth={3}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className='shadow overflow-hidden rounded-xl border border-stone-200'>
					<table className="bg-white w-full rounded-xl overflow-hidden">
						<tr className="text-lg text-left bg-stone-100 *:py-3">
							<th className="font-normal pl-6">Date</th>
							<th className="font-normal w-[40%]">Name</th>
							<th className="font-normal">User</th>
							<th className="font-normal text-right pr-6">Amount</th>
						</tr>
						{contributions.map((cont) => {
							return (
								<tr key={cont.id} className='border-t border-stone-200 *:py-3'>
									<td className="pl-6">
										{new Date(cont.created_at).toDateString()}
									</td>
									<td>SAVINGS TRANSFER FOR GOAL</td>
									<td className='capitalize'>{cont.user.name}</td>
									<td className='text-right pr-6'>+{formatCurrency(cont.amount)}</td>
								</tr>
							)
						})}
					</table>
				</div>
			</div>
		</MainLayout>
	)
}

export default GoalDetailsPage
