import { useAccount } from '../contexts/AccountContext'
import { useUser } from '../contexts/UserContext'
import { Button } from './Button'

export const LogoutButton = () => {
	const { setUser } = useUser()
	const { setAccounts } = useAccount()

	const handleLogout = async () => {
		await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})

		setUser(null)
		setAccounts([{
			id: -1,
			account_name: '',
			bank_name: '',
			user_id: '',
			balances: {
				available: 0,
				current: 0,
				currency_code: '',
			},
			subtype: '',
			type: '',
		}])
	}

	return <Button onClick={handleLogout}>Log Out</Button>
}
