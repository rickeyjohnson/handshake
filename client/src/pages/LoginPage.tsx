import { Link, useNavigate } from 'react-router'
import { Button } from '../components/ui/Button'
import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { Label } from '../components/ui/Label'
import { Input } from '../components/ui/Input'
import Logo from '../components/Logo'

const LoginPage = () => {
	const [loginData, setLoginData] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const { setUser } = useUser()
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setLoginData((prev) => ({ ...prev, [name]: value }))
		setError('')
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginData),
				credentials: 'include',
			})

			const data = await response.json()

			if (!response.ok) {
				setError(data.error)
				return
			}

			setUser(data)

			if (!data.is_plaid_linked) {
				navigate('/connect-bank')
			} else if (!data.is_paired) {
				navigate('/pair')
			} else {
				navigate('/dashboard')
			}
		} catch (error) {
			console.error('Network Error: Please try again', error)
		}
	}

	return (
		<div className="flex justify-center items-center h-screen min-h-svh relative">
			<Logo className='absolute top-6 left-6 not-sm:right-6'/>
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md items-center p-8 gap-2 m-3 z-10">
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

					<Button type="submit" className="my-2" title="Log In">
						Log In
					</Button>

					{error ? (
						<p className="py-4 text-center font-medium">{error}</p>
					) : (
						<></>
					)}
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
