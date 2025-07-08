import { IconCirclePlusFilled } from '@tabler/icons-react'
import { Button } from '../components/Button'
import Goal from '../components/Goal'
import MainLayout from '../components/MainLayout'
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'
import AddGoalsModal from '../components/AddGoalsModal'
import { useNavigate } from 'react-router'
import MainHeader from '../components/MainHeader'

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
	const navigate = useNavigate()
	const [goals, setGoals] = useState<Goal[]>([])
	const [openAddGoalsModal, setOpenAddGoalsModal] = useState(false)

	const fetchGoals = async () => {
		try {
			const response = await fetch('/api/goals', {
				headers: { 'Content-Type': 'application/json' },
			})
			const goals = await response.json()
			setGoals(goals)
		} catch (err) {
			console.error(err)
		}
	}

	const handleGoalClick = (id: string) => {
		navigate(`/goals/${id}`)
	}

	useEffect(() => {
		fetchGoals()
	}, [])

	return (
		<MainLayout>
			<div className="">
				<MainHeader
					title="Goals"
					caption={`Set goals with ${
						user?.partner?.name || 'partner'
					}`}
				>
					<Button
						className="flex items-center gap-2 self-center"
						onClick={() => setOpenAddGoalsModal(true)}
					>
						<IconCirclePlusFilled size={18} />
						Add Goal
					</Button>
				</MainHeader>
				<div className="flex flex-wrap gap-7 p-4 pt-0">
					{goals && goals.length > 0 ? (
						goals.map((goal) => {
							return (
								<Goal
									key={goal.id}
									title={goal.title}
									current={goal.current}
									target={goal.target}
									onClick={() => handleGoalClick(goal.id)}
								/>
							)
						})
					) : (
						<div className="">No goals to see here</div>
					)}
				</div>
			</div>
			{openAddGoalsModal && (
				<AddGoalsModal
					partner="user"
					handleClose={() => {
						fetchGoals()
						setOpenAddGoalsModal(false)}}
				/>
			)}
		</MainLayout>
	)
}

export default GoalsPage
