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

			{/* {image && (
				<>
					<br />
					<p>{selectedPrice}</p>
					<AddExpenseForm selectedAmount={selectedPrice} />
				</>
			)} */}

			{image ? (
				<div className='flex items-center gap-5 px-12 flex-wrap justify-center'>
					<PriceSelection
						image_url={image}
						onSelection={handleSelection}
						className='flex-grow flex justify-center'
					/>
					<AddExpenseForm selectedAmount={selectedPrice} />
				</div>
			) : (
				<ReceiptCapture onCapture={handleCapture} />
			)}
		</MainLayout>
	)
}

export default AddExpensePage
