import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Link, useNavigate } from 'react-router'
import { useUser } from '../contexts/UserContext'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'

const SignUpPage = () => {
	const [signUpData, setSignUpData] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const { setUser } = useUser()
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setSignUpData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(signUpData),
			})

			const data = await response.json()

			if (response.ok) {
				console.log('Account creation successfully')
				setUser(data)
				navigate('/connect-bank')
			} else {
				console.error('Failed to create account: ', data.error)
				setError(data.error)
			}
		} catch (error) {
			console.error('Network error. Please try again', error)
		}
	}

	return (
		<div className="flex justify-center items-center h-screen min-h-svh">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm items-center p-8 gap-2">
				<h1 className="text-xl font-semibold self-start">Sign Up</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Enter your name and email below to create an account
				</p>

				<form
					className="flex flex-col w-full mt-3"
					onSubmit={handleSubmit}
				>
					<Label htmlFor="name">Name</Label>
					<Input
						type="text"
						id="name"
						value={signUpData.name}
						name="name"
						required={true}
						onChange={handleChange}
					/>

					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						value={signUpData.email}
						name="email"
						required={true}
						onChange={handleChange}
					/>

					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						id="password"
						value={signUpData.password}
						name="password"
						required={true}
						onChange={handleChange}
					/>

					<Button type="submit" className="my-2">
						Sign Up
					</Button>

					{error ? <p>{error}</p> : <></>}
				</form>
				<p>
					Already have an account?{' '}
					<span>
						<Link to="/login" className="underline">
							Log in
						</Link>
					</span>
				</p>
			</div>
		</div>
	)
}

export default SignUpPage
