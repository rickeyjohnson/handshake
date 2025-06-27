import { Link } from "react-router"
import { Button } from "../components/Button"
import { usePlaidLink } from "react-plaid-link"
import { useEffect, useState } from "react"

const LinkPlaid = () => {
  const [linkToken, setLinkToken] = useState(null)

  const generateToken = async () => {
    const response = await fetch('/api/plaid/create_link_token', {
      method: 'POST',
    })

    const data = await response.json()
    setLinkToken(data.link_token)
  }

  useEffect(() => {
    generateToken()
  }, [])

  return (
    <div>Linking Plaid...

        <Link to='/dashboard'>
            <Button>to dashboard</Button>
        </Link>
    </div>
  )
}

export default LinkPlaid