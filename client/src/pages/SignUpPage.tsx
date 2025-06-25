import { useState } from 'react'
import Button from '../components/Button'
import { Link } from 'react-router'
import { useUser } from '../contexts/UserContext'

const SignUpPage = () => {
	const [signUpData, setSignUpData] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [error, hasError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const { setUser } = useUser()

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
				console.log('Post added successfully')
				setUser(data)
				window.location.href = '/dashboard'
			} else {
				console.error('Failed to create account: ', data.error)
				hasError(!error)
				setErrorMessage(data.error)
			}
		} catch (error) {
			console.error('Network error. Please try again', error)
		}
	}

	return (
		<div>
			<h1 className="text-4xl">Sign Up</h1>
			<form className="flex flex-col w-fit" onSubmit={handleSubmit}>
				<label htmlFor="name">Name</label>
				<input
					type="text"
					id="name"
					value={signUpData.name}
					name="name"
					required={true}
					className="border rounded"
					onChange={handleChange}
				/>

				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					value={signUpData.email}
					name="email"
					required={true}
					className="border rounded"
					onChange={handleChange}
				/>

				<label htmlFor="password">Password</label>
				<input
					type="text"
					id="password"
					value={signUpData.password}
					name="password"
					required={true}
					className="border rounded"
					onChange={handleChange}
				/>

				<Button type="submit">Sign Up</Button>

				{error ? <p>{errorMessage}</p> : <></>}
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
