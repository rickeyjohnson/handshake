import { useState } from 'react'
import Button from '../components/Button'
import { Link } from 'react-router'

const SignUpPage = () => {
	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log({
			page: 'sign up',
			name,
			email,
			password,
		})
	}

	return (
		<div>
			<h1 className="text-4xl">Sign Up</h1>
			<form className="flex flex-col w-fit" onSubmit={handleSubmit}>
				<label htmlFor="name">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					required={true}
					className="border rounded"
					onChange={(e) => setName(e.target.value)}
				/>

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

				<Button type="submit">Sign Up</Button>
			</form>
			<p>
				Already have an account?
				<Link to="/login" className="underline">
					Log in
				</Link>
			</p>
		</div>
	)
}

export default SignUpPage
