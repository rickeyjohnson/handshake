import { Link, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { useState } from 'react'
import { useUser } from '../contexts/UserContext'

const LoginPage = () => {
	const [loginData, setLoginData] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const { setUser } = useUser()
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setLoginData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginData),
			})

			const data = await response.json()

			if (response.ok) {
				console.log('Login successfully')
				setUser(data)
				navigate('/dashboard')
			} else {
				console.error('Failed to create account: ', data.error)
				setError(data.error)
			}
		} catch (error) {
			console.error('Network error. Please try again', error)
		}
	}

	return (
		<div>
			<h1 className="text-4xl">Login</h1>
			<form className="flex flex-col w-fit" onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					required={true}
					className="border rounded"
					onChange={handleChange}
				/>

				<label htmlFor="password">Password</label>
				<input
					type="text"
					id="password"
					name="password"
					required={true}
					className="border rounded"
					onChange={handleChange}
				/>

				<Button type="submit">Log In</Button>

				{error ? <p>{error}</p> : <></>}
			</form>
			<p>
				Don't have an account?
				<Link to="/signup" className="underline">
					Sign Up
				</Link>
			</p>
		</div>
	)
}

export default LoginPage
