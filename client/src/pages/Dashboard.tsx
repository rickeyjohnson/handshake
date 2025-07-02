import { useEffect, useState } from 'react'
import { LogoutButton } from '../components/LogoutButton'
import { useUser } from '../contexts/UserContext'

const Dashboard = () => {
	const { user } = useUser()
	const [accounts, setAccounts] = useState({})

	const fetchAccounts = async () => {
		try {
			const response = await fetch('/api/plaid/accounts', {
				headers: { 'Content-Type' : 'application/json' }
			})
			const data = await response.json()

			setAccounts(data)
		} catch(err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchAccounts()
	})

	return (
		<div>
			{user ? <p>Hello, {user.name}</p> : <p>Hello, User</p>}

			<LogoutButton />
		</div>
	)
}

export default Dashboard
