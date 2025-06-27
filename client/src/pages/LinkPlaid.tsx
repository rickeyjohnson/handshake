import { usePlaidLink } from 'react-plaid-link'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Link } from 'react-router'

const LinkPlaid = () => {
	const [linkToken, setLinkToken] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const generateToken = async () => {
		console.log('generating link_token')
		const response = await fetch('/api/plaid/create_link_token', {
			method: 'POST',
		})

		const data = await response.json()
		setLinkToken(data.link_token)
	}

	const onSuccess = useCallback((public_token: string) => {
		try {
			fetch('/api/plaid/set_access_token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ public_token }),
			})

			setIsLoading(false)
		} catch (error: any) {
			console.log(error.message)
		}

		setIsLoading(false)
	}, [])

	const config = {
		token: linkToken,
		onSuccess,
	}

	const { open, ready } = usePlaidLink(config)

	useEffect(() => {
		setIsLoading(true)
		generateToken()
		setIsLoading(false)
	}, [])

	return (
		<div className="flex h-screen w-screen justify-center items-center relative">
      <Link to='/signup' className='absolute left-5 top-5'>
        <Button variant='ghost' className='flex justify-center items-center'>
          <span className="material-icons">
            arrow_back
          </span>
        </Button>
      </Link>
      <Button
        onClick={() => {
          setIsLoading(true)
          open()
        }}
        disabled={!ready}
      >
        Link Bank
      </Button>
		</div>
	)
}

export default LinkPlaid
