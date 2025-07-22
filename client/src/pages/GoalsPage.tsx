import { IconCirclePlusFilled } from '@tabler/icons-react'
import { Button } from '../components/ui/Button'
import Goal from '../components/Goal'
import MainLayout from '../components/layout/MainLayout'
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'
import AddGoalsModal from '../components/AddGoalsModal'
import { useNavigate } from 'react-router'
import MainHeader from '../components/layout/MainHeader'
import { useWebSocket } from '../contexts/WebsocketContext'
import { type GoalType } from '../types/types'

const GoalsPage = () => {
	const { user } = useUser()
	const navigate = useNavigate()
	const [goals, setGoals] = useState<GoalType[]>([])
	const [openAddGoalsModal, setOpenAddGoalsModal] = useState(false)
	const { socket } = useWebSocket()

	const fetchGoals = async () => {
		try {
			const response = await fetch('/api/goals', {
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
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

	useEffect(() => {
		if (!socket) return

		const handleNewGoal = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)

				if (data.object === 'goal') {
					// Stretch Goals: pair_id for pairs account refresh
					fetchGoals()
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
			<div>
				<MainHeader
					title="Goals"
					caption={`Set goals with ${
						user?.partner?.name || 'partner'
					}`}
				>
					<Button
						className="flex items-center gap-2 h-fit"
						onClick={() => setOpenAddGoalsModal(true)}
					>
						<IconCirclePlusFilled size={18} />
						Add Goal
					</Button>
				</MainHeader>
				<div className="flex flex-wrap gap-10 p-4 pt-0 justify-center">
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
						setOpenAddGoalsModal(false)
					}}
				/>
			)}
		</MainLayout>
	)
}

export default GoalsPage
