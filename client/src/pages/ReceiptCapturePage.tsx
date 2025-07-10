import { Outlet, useNavigate } from "react-router"
import MainLayout from "../components/MainLayout"
import MainHeader from "../components/MainHeader"
import { Button } from "../components/Button"

const ReceiptCapturePage = () => {
    const navigate = useNavigate()
    const handleNavigation = () => {
		navigate('/transactions/price-selection')
	}

  return (
    <MainLayout>
        <MainHeader title="Add Expense: Receipt Capture">
            <Button onClick={handleNavigation}>Continue</Button>
        </MainHeader>
    </MainLayout>
  )
}

export default ReceiptCapturePage