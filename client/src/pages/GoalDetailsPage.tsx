import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import MainLayout from '../components/MainLayout'

type Goal = {
	id: string
	user_id: string
	pair_id: string
	title: string
	description: string | null
	target: number
	current: number
	deadline: Date | null
	created_at: Date
	updated_at: Date
}

const GoalDetailsPage = () => {
	const { id } = useParams()
	const [goal, setGoal] = useState<Goal>({
		id: '',
		user_id: '',
		pair_id: '',
		title: '',
		description: '',
		target: 0,
		current: 0,
		deadline: new Date(),
		created_at: new Date(),
		updated_at: new Date(),
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
			<div>Details Page:{goal.id}</div>
		</MainLayout>
	)
}

export default GoalDetailsPage
