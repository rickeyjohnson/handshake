import MainLayout from '../components/MainLayout'
import MainHeader from '../components/MainHeader'
import ReceiptCapture from '../components/ReceiptCapture'

const AddExpensePage = () => {
  return (
    <MainLayout>
        <MainHeader title="Add New Expense" />
        
        <ReceiptCapture />
    </MainLayout>
  )
}

export default AddExpensePage