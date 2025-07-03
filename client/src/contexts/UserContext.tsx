import { createContext, useState, useContext, useEffect, type SetStateAction, type Dispatch } from 'react'

type User = {
	id: string,
	name: string,
	email: string
}

interface UserContextType {
	user: User | null
	loading: boolean
	setUser: Dispatch<SetStateAction<User | null>>
}

const defaultUserContext: UserContextType = {
	user: null,
	loading: true,
	setUser: () => {},
}

const UserContext = createContext<UserContextType>(defaultUserContext) // Find typing for usercontext

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

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
				}
			} catch (err) {
				setUser(null)
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
