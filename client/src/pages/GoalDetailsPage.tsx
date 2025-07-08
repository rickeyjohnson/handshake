import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import MainLayout from '../components/MainLayout'
import MainHeader from '../components/MainHeader'

type User = {
	id: string
	name: string
	email: string
	is_plaid_linked: boolean
	is_paired: boolean
	partner: {
		name: string
	}
}

type GoalContributions = {
	id: string
	goal_id: string
	user_id: string
	user: User
	amount: number
	created_at: Date
}

type Goal = {
	id: string
	user_id: string
	user: User | null
	pair_id: string
	title: string
	description: string | null
	target: number
	current: number
	deadline?: Date | null
	created_at: Date
	updated_at: Date
	contributions: GoalContributions[]
}

const GoalDetailsPage = () => {
	const { id } = useParams()
	const [goal, setGoal] = useState<Goal>({
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
	})

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

			<div>
				<div className=" box-border border-2 border-stone-100 shadow rounded-xl w-[50%] p-4 m-4">
					<h1 className="">${goal.current}</h1>
					<div>
						<p>Total Goal</p>
						<p>{goal.target}</p>
					</div>
					{goal.deadline && (
						<div>
							<p>Target Completion Date</p>
							<p>{new Date(goal.deadline).toDateString()}</p>
						</div>
					)}
				</div>
				<div></div>
			</div>
		</MainLayout>
	)
}

export default GoalDetailsPage
