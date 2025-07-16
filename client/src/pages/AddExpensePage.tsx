import MainLayout from '../components/layout/MainLayout'
import MainHeader from '../components/layout/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'
import { useState } from 'react'
import PriceSelection from '../components/PriceSelection'
import AddExpenseForm from '../components/AddExpenseForm'

const AddExpensePage = () => {
	const [image, setImage] = useState<string | null>(null)
	const [selectedPrice, setSelectedPrice] = useState<string>('0.00')

	const handleCapture = async (url: string) => {
		setImage(url)
	}

	const handleSelection = (price: string) => {
		setSelectedPrice(price)
	}

	return (
		<MainLayout>
			<MainHeader title="Add New Expense" />

			<ReceiptCapture onCapture={handleCapture} />
			{image && (
				<PriceSelection
					image_url={image}
					onSelection={handleSelection}
				/>
			)}

			<br />

			<p>{selectedPrice}</p>

			<AddExpenseForm selectedAmount={selectedPrice} />
		</MainLayout>
	)
}

export default AddExpensePage
