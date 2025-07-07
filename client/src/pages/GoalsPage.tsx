import Goal from '../components/Goal'
import MainLayout from '../components/MainLayout'

const GoalsPage = () => {
	const goals = [
		{
			id: 1,
			user_id: 1,
			pair_id: 1,
			title: 'Dream Wedding',
			description: 'Saving for wedding venue, food, and decorations',
			target: 20000,
			current: 5000,
			deadline: '2026-6-15',
		},
		{
			id: 2,
			user_id: 2,
			pair_id: 2,
			title: 'Down Payment on a House',
			description: 'Saving for down payment on a new home',
			target: 30000,
			current: 10000,
			deadline: '2027-3-20',
		},
		{
			id: 3,
			user_id: 3,
			pair_id: 3,
			title: 'European Vacation',
			description:
				'Saving for flights, accommodations, and activities in Europe',
			target: 8000,
			current: 2000,
			deadline: '2025-8-25',
		},
		{
			id: 4,
			user_id: 4,
			pair_id: 4,
			title: 'Paying Off Student Loans',
			description: 'Paying off outstanding student loan debt',
			target: 15000,
			current: 5000,
			deadline: '2028-12-31',
		},
		{
			id: 5,
			user_id: 5,
			pair_id: 5,
			title: 'Starting a Business',
			description: 'Saving for startup costs and initial investments',
			target: 25000,
			current: 7500,
			deadline: '2026-9-1',
		},
		{
			id: 6,
			user_id: 6,
			pair_id: 6,
			title: 'Retirement Fund',
			description: 'Saving for long-term retirement goals',
			target: 50000,
			current: 15000,
			deadline: '2035-12-31',
		},
		{
			id: 7,
			user_id: 7,
			pair_id: 7,
			title: 'Home Renovation',
			description: 'Saving for renovations and upgrades to current home',
			target: 12000,
			current: 4000,
			deadline: '2027-6-30',
		},
		{
			id: 8,
			user_id: 8,
			pair_id: 8,
			title: 'Car Replacement',
			description: 'Saving for a new car to replace current vehicle',
			target: 10000,
			current: 3000,
			deadline: '2026-3-15',
		},
		{
			id: 9,
			user_id: 9,
			pair_id: 9,
			title: 'Emergency Fund',
			description: 'Building an emergency fund for unexpected expenses',
			target: 6000,
			current: 2000,
			deadline: '2025-12-31',
		},
		{
			id: 10,
			user_id: 10,
			pair_id: 10,
			title: 'Honeymoon',
			description: 'Saving for a dream honeymoon trip',
			target: 5000,
			current: 1500,
			deadline: '2027-9-20',
		},
	]

	return (
		<MainLayout>
			<div>
				<h1 className="semibold text-3xl pl-5 p-4">Goals</h1>
				<div>
					{goals.map((goal) => {
						return <p>{goal.title}</p>
					})}
				</div>
			</div>
			<Goal />
		</MainLayout>
	)
}

export default GoalsPage
