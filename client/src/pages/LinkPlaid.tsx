import { usePlaidLink } from 'react-plaid-link'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Link, useNavigate } from 'react-router'

const LinkPlaid = () => {
	const [linkToken, setLinkToken] = useState(null)
	const [isError, setIsError] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const generateToken = async () => {
		console.log('generating link_token')
		const response = await fetch('/api/plaid/create_link_token', {
			method: 'POST',
		})

		const data = await response.json()
		setLinkToken(data.link_token)
	}

	const onSuccess = useCallback((public_token: string) => {
		setLoading(true)
		try {
			fetch('/api/plaid/exchange_public_token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ public_token: public_token }),
			})
			.then(res => res.json())
			.then(data => {
				if (data.error) {
					setIsError(true)
				} else {
					navigate('/pair')
				}
			})
		} catch (error: any) {
			console.log(error.message)
		}
		
		setLoading(false)
	}, [])

	const config = {
		token: linkToken,
		onSuccess,
	}

	const { open, ready } = usePlaidLink(config)

	useEffect(() => {
		setLoading(true)
		generateToken()
		setLoading(false)
	}, [])

	return (
		<div className="flex flex-col gap-5 h-screen w-screen justify-center items-center relative">
			<Link to="/signup" className="absolute left-5 top-5">
				<Button
					variant="ghost"
					className="flex justify-center items-center"
				>
					<span className="material-icons">arrow_back</span>
				</Button>
			</Link>

			<h1 className="text-center text-3xl">
				Connect bank via Plaid to continue creating your account.
			</h1>

			{isError ? <p className='bg-red-200 py-4 px-8 rounded-md border-red-700 border-4 text-red-700 font-medium text-lg'>Error connecting bank</p> : <></>}

			<Button onClick={() => open()} disabled={!ready} className={loading ? 'bg-amber-300' : ''}>
				Connect Bank
			</Button>
		</div>
	)
}

export default LinkPlaid
