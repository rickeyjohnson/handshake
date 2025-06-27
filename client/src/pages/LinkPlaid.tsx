import { usePlaidLink } from "react-plaid-link"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../components/Button"

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
      const response = fetch('/api/plaid/set_access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      })

    } catch(error: any) {
      console.log(error.message)
    }

  }, [])

  const config = {
    token: linkToken,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  useEffect(() => {
    setIsLoading(true)
    generateToken()
  }, [])

  return (
    <div>{isLoading ? 'Linking Plaid...' : 'Plaid Linked'}
      <Button onClick={() => open()} disabled={!ready}>Link Plaid</Button>
    </div>
  )
}

export default LinkPlaid