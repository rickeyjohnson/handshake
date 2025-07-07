import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'
import { useUser } from '../contexts/UserContext'
import { Button } from './Button'

export const LogoutButton = () => {
	const { setUser } = useUser()
	const { setAccounts } = useAccount()
	const { setTransactions } = useTransactions()

	const handleLogout = async () => {
		await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})

		setUser(null)
		setAccounts([])
		setTransactions([])
	}

	return <Button onClick={handleLogout}>Log Out</Button>
}
