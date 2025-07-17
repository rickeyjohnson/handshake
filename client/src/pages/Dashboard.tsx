import MainHeader from '../components/layout/MainHeader'
import MainLayout from '../components/layout/MainLayout'
import NetWorth from '../components/NetWorth'
import { useUser } from '../contexts/UserContext'

const Dashboard = () => {
	const { user } = useUser()
	
	return (
	<MainLayout>
		<MainHeader title={`Welcome ${user?.name || 'Partner'}`} caption={`Today is ${new Date().toDateString()}`} />
		<NetWorth />
	</MainLayout>
	)
}

export default Dashboard
