import { useUser } from "../contexts/UserContext"

const Dashboard = () => {
  const { user } = useUser()

  return (
    <div>
      Hello, {user?.name ?? 'ERROR'}
    </div>
  )
}

export default Dashboard