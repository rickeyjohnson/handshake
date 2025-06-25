import { Link } from 'react-router'
import Button from '../components/Button'
import { useState } from 'react'

const LoginPage = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log({
			page: 'log in',
			email,
			password,
		})
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
					onChange={(e) => setEmail(e.target.value)}
				/>

				<label htmlFor="password">Password</label>
				<input
					type="text"
					id="password"
					name="password"
					required={true}
					className="border rounded"
					onChange={(e) => setPassword(e.target.value)}
				/>

				<Button type="submit">Log In</Button>
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
