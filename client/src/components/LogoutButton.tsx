import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'
import { useUser } from '../contexts/UserContext'
import { Button } from './ui/Button'
import { IconLogout } from '@tabler/icons-react'

export const LogoutButton = ({ className }: { className?: string }) => {
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

	return (
		<Button
			className={`${className}`}
			variant="dashboard"
			onClick={handleLogout}
		>
			<IconLogout size={18} />
			Log Out
		</Button>
	)
}
