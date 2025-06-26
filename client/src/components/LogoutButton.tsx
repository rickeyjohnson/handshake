import { useUser } from '../contexts/UserContext'
import { Button } from './Button'

export const LogoutButton = () => {
	const { setUser } = useUser()

	const handleLogout = async () => {
		await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})

		setUser(null)
		window.location.href = '/'
	}

	return <Button onClick={handleLogout}>Log Out</Button>
}
