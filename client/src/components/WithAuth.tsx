import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

// TODO: allow reload on site without triggering user log in

export const WithAuth = (WrappedComponent: React.ComponentType<object>) => {
	return function ProtectedComponent(props: object) {
		const { user, loading } = useUser()
		const navigate = useNavigate()

		useEffect(() => {
			if (!loading && !user) {
				console.log('Not logged in')
				navigate('/login')
			}
		}, [user, loading, navigate])

		if (loading) {
			return <p>Loading...</p>
		}

		return <WrappedComponent {...props} />
	}
}
