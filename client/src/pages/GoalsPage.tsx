import { IconCirclePlusFilled } from '@tabler/icons-react'
import { Button } from '../components/Button'
import Goal from '../components/Goal'
import MainLayout from '../components/MainLayout'
import { useUser } from '../contexts/UserContext'
import { useState } from 'react'

type Goal = {
	id: string
	user_id: string
	pair_id: string
	title: string
	current: number
	target: number
	description: string
	deadline: string
}

const GoalsPage = () => {
	const { user } = useUser()
	const [goals, setGoals] = useState<Goal[]>([])

	return (
		<MainLayout>
			<div>
				<div className="px-5 p-4 flex w-full">
					<div className='grow'>
						<h1 className="semibold text-3xl">Goals</h1>
						<p className="text-gray-500 capitalize">
							Set goals with {user?.partner?.name || 'partner'}
						</p>
					</div>
					<Button className="flex items-center gap-2 self-center">
						<IconCirclePlusFilled size={18} />
						Add Goal
					</Button>
				</div>
				<div className="flex flex-wrap gap-7 p-4 pt-0">
					{goals && goals.length > 0 ? (goals.map((goal) => {
						return (
							<Goal
								key={goal.id}
								title={goal.title}
								current={goal.current}
								target={goal.target}
							/>
						)
					})) : (<p>No goals to see here</p>)}
				</div>
			</div>
		</MainLayout>
	)
}

export default GoalsPage
