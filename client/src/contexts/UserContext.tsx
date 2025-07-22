import { createContext, useState, useContext, useEffect } from 'react'
import { type User, type UserContextType } from '../types/types'
import { useNavigate } from 'react-router'

const defaultUserContext: UserContextType = {
	user: null,
	loading: true,
	setUser: () => {},
}

const UserContext = createContext<UserContextType>(defaultUserContext)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/me', {
					credentials: 'include',
				})
				if (response.ok) {
					const data = await response.json()
					setUser(data)
				} else {
					setUser(null)
					navigate('/login')
				}
			} catch (err) {
				console.error(err)
				setUser(null)
				navigate('/login')
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [])

	return (
		<UserContext.Provider value={{ user, loading, setUser }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => useContext(UserContext)
