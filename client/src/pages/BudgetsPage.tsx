import MainHeader from '../components/MainHeader'
import MainLayout from '../components/MainLayout'
import { useUser } from '../contexts/UserContext'

const BudgetsPage = () => {
	const { user } = useUser()

	return <MainLayout>
		<MainHeader title={"Budget"} caption={`Create budgets with ${user?.partner?.name}`} />

		
	</MainLayout>
}

export default BudgetsPage
