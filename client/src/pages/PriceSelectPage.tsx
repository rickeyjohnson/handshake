import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import MainHeader from '../components/MainHeader'
import MainLayout from '../components/MainLayout'

const PriceSelectPage = () => {
	const navigate = useNavigate()
	const handleNavigation = () => {
		navigate('/transactions/addition-summary')
	}

	return (
		<MainLayout>
			<MainHeader title="Add Expense: Price Selection">
				<Button onClick={handleNavigation}>Continue</Button>
			</MainHeader>
		</MainLayout>
	)
}

export default PriceSelectPage
