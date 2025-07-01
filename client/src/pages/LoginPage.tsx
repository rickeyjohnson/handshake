import { Link, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { Label } from '../components/Label'
import { Input } from '../components/Input'

const LoginPage = () => {
	const [loginData, setLoginData] = useState({ email: '', password: '' })
	const [error] = useState('')
	const { setUser } = useUser()
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setLoginData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			// REMOVE localhost:3000 during development
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginData),
			})

			const data = await response.json()
			setUser(data)

			if (!data.plaidToken) {
				navigate('/connect-bank')
			} else if (!data.partnerId) {
				navigate('/pair')
			} else {
				navigate('/dashboard')
			}
		} catch (error) {
			console.error('Network Error: Please try again', error)
		}
	}

	return (
		<div className="flex justify-center items-center h-screen min-h-svh">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm items-center p-8 gap-2">
				<h1 className="text-xl font-semibold self-start">Login</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Enter your email below to log into your account
				</p>

				<form
					className="flex flex-col w-full mt-3"
					onSubmit={handleSubmit}
				>
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						required={true}
						onChange={handleChange}
					/>

					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						id="password"
						name="password"
						required={true}
						onChange={handleChange}
					/>

					<Button type="submit">Log In</Button>

					{error ? <p>{error}</p> : <></>}
				</form>
				<p>
					Don't have an account?{' '}
					<span>
						<Link to="/signup" className="underline">
							Sign Up
						</Link>
					</span>
				</p>
			</div>
		</div>
	)
}

export default LoginPage
