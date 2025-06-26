import { useUser } from "../contexts/UserContext"

const Dashboard = () => {
  const { user } = useUser()

  return (
    <div>
      {user ? <p>Hello, {user.name}</p> : <p>Loading...</p>}
    </div>
  )
}

export default Dashboard