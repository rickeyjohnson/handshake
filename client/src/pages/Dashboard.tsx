import LogoutButton from "../components/LogoutButton"
import { useUser } from "../contexts/UserContext"

const Dashboard = () => {
  const { user } = useUser()

  return (
    <div>
      {user ? <p>Hello, {user.name}</p> : <p>Hello, User</p>}

      <LogoutButton />
    </div>
  )
}

export default Dashboard