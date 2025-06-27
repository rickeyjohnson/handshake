import { Link } from "react-router"
import { Button } from "../components/Button"

const LinkPlaid = () => {
  return (
    <div>Linking Plaid...

        <Link to='/dashboard'>
            <Button>to dashboard</Button>
        </Link>
    </div>
  )
}

export default LinkPlaid