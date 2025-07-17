import MainLayout from '../components/layout/MainLayout'
import MainHeader from '../components/layout/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'
import { useState } from 'react'
import PriceSelection from '../components/PriceSelection'
import AddExpenseForm from '../components/AddExpenseForm'
import { Button } from '../components/ui/Button'
import { IconChevronLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router'

const AddExpensePage = () => {
	const [image, setImage] = useState<string | null>(null)
	const [selectedPrice, setSelectedPrice] = useState<string>('0.00')
	const navigate = useNavigate()

	const handleCapture = async (url: string) => {
		setImage(url)
	}

	const handleSelection = (price: string) => {
		setSelectedPrice(price)
	}

	const handleBackButton = () => {
		if (image) {
			setImage(null)
			setSelectedPrice('0.00')
		} else {
			navigate('/transactions')
		}
	}

	return (
		<MainLayout>
			<MainHeader title="Add New Expense">
				<Button
					className="flex gap-2 align-center items-center self-center"
					onClick={handleBackButton}
				>
					<IconChevronLeft size={18} />
					{image ? 'Retake Picture' : 'Back to Transactions'}
				</Button>
			</MainHeader>

			{image ? (
				<div className="flex items-center gap-20 flex-wrap justify-center">
					<div className="relative">
						<h1 className="text-center">
							Select the Expense to Add to Your New Expense
						</h1>
						<PriceSelection
							image_url={image}
							onSelection={handleSelection}
							className="flex-grow flex justify-center my-2"
						/>
					</div>
					<AddExpenseForm selectedAmount={selectedPrice} />
				</div>
			) : (
				<ReceiptCapture onCapture={handleCapture} />
			)}
		</MainLayout>
	)
}

export default AddExpensePage
