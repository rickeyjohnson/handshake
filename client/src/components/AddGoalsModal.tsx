import { Input } from './Input'
import { Button } from './Button'
import React, { useState } from 'react'
import { Label } from './Label'

const AddGoalsModal = ({partner}: {partner: string}) => {
    const [name, setName] = useState('')
    const [date, setDate] = useState('');
    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submitted')
    }

    const is_number = (str: string) => {
        if (!str) return true
        if (typeof str !== 'string') return false

        const parsed = parseFloat(str)
        return !isNaN(parsed) && isFinite(parsed) && String(parsed) === str
    }

	return (
		<div className="h-screen w-screen bg-gray-400/10 absolute flex justify-center items-center">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm p-8 gap-2 relative">
				<h1 className="text-xl font-semibold self-start capitalize">
                        add new goal
                    </h1>
                    <p className="self-start text-gray-500 font-light text-md">
                        Add a new goal that will be shared between you and {partner ?? 'your partner'}.
                    </p>
        
                    <form className='flex flex-col' onSubmit={(e) => handleSubmit(e)}>
                        <Label>Name</Label>
                        <Input
                            placeholder=""
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            className=""
                            required={true}
                        />
                        
                        <Label>Date</Label>
                        <Input
                            type='date'
                            placeholder="MM/DD/YYYY"
                            value={date}
                            onChange={(e) => {
                                console.log(e.target.value)
                                setDate(e.target.value)
                            }}
                            className=""
                            required={true}
                        />
                        
                        <Label>Target Amount</Label>
                        <Input
                            placeholder=""
                            value={`$${target}`}
                            onChange={(e) => {
                                const tar = e.target.value.substring(1)
                                if (is_number(tar)) { setTarget(e.target.value.substring(1)) }
                            }}
                            className="mt-2 mb- text-center font-medium text-5xl w-full"
                            required={true}
                        />
                        
                        <Label>Description</Label>
                        <Input
                            placeholder=""
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            className=""
                            required={true}
                        />
                        
                        <Button
                            onClick={() => {
                                
                            }}
                            className="w-full"
                            type='submit'
                        >
                            Create
                        </Button>
                    </form>
       
                    <Button
                        variant="ghost"
                        className="flex justify-center items-center w-10 h-10 absolute right-2 top-2"
                    >
                        <span className="material-icons w-6">close</span>
                    </Button>

                    
			</div>
		</div>
	)
}

export default AddGoalsModal
