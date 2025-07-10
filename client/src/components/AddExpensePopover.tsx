import { useNavigate } from 'react-router'
import { Button } from './Button'
import { IconCamera, IconPencil } from '@tabler/icons-react'

const AddExpensePopover = () => {
	const navigate = useNavigate()
	const handleNavigation = () => {
		navigate('/transactions/add-expense')
	}

	return (
		<div className="flex flex-col items-start border-2 border-stone-200 rounded-lg p-1 px-2 absolute z-50 bg-white w-xs right-0 top-12">
			<div className="w-full text-left p-1">
				<Button variant="ghost" className="flex gap-2 w-full text-left">
					<IconPencil />
					Enter Expense Manually
				</Button>
			</div>

			<div className="border-t-2 border-t-stone-200 w-full text-left p-1">
				<Button
					variant="ghost"
					className="flex gap-2 w-full"
					onClick={handleNavigation}
				>
					<IconCamera />
					Capture Reciept
				</Button>
			</div>
		</div>
	)
}

export default AddExpensePopover
