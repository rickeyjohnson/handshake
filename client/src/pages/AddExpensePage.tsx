import MainLayout from '../components/MainLayout'
import MainHeader from '../components/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'
import { useState } from 'react'
import PriceSelection from '../components/PriceSelection'

const AddExpensePage = () => {
	const [image, setImage] = useState<string | null>(null)
	const [selectedPrice, setSelectedPrice] = useState<string>('-1')

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
		</MainLayout>
	)
}

export default AddExpensePage
