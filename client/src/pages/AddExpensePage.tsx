import MainLayout from '../components/MainLayout'
import MainHeader from '../components/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'
import { useState } from 'react'
import PriceSelection from '../components/PriceSelection'

const AddExpensePage = () => {
	const [image, setImage] = useState<string | null>(null)
	const [prices, setPrices] = useState<any>([]) // TODO: remove "any" when finished

	const handleCapture = async (url: string) => {
		setImage(url)
	}

	return (
		<MainLayout>
			<MainHeader title="Add New Expense" />

			<ReceiptCapture onCapture={handleCapture} />
			{image && <PriceSelection image_url={image} />}
		</MainLayout>
	)
}

export default AddExpensePage
