import MainLayout from '../components/MainLayout'
import MainHeader from '../components/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'
import { useState } from 'react'

const AddExpensePage = () => {
    const [image, setImage] = useState<string | null>(null) 

    const handleCapture = (url: string) => {
        setImage(url)
        console.log('image captured!')
    }

  return (
    <MainLayout>
        <MainHeader title="Add New Expense" />
        
        <ReceiptCapture onCapture={handleCapture}/>
    </MainLayout>
  )
}

export default AddExpensePage