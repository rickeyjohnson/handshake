import { useAccount } from '../contexts/AccountContext'
import { useTransactions } from '../contexts/TransactionsContext'
import { useUser } from '../contexts/UserContext'
import { Button } from './Button'
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
		<button className={`${className} text-xs flex gap-2 text-gray-800 hover:bg-gray-200/50 p-2 w-full rounded-lg`} onClick={handleLogout}>
			<IconLogout size={16} color='gray'/>
			Log Out
		</button>
	)
}
