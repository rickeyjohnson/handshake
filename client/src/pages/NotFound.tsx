import React from 'react'
import { Button } from '../components/Button'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen gap-4'>
        <h1 className='text-xl font-medium text-center'>This page does not exist.</h1>
        <Link to='/'>
            <Button variant='ghost sm: hover: bg-red'>Home</Button>
        </Link>
    </div>
  )
}

export default NotFound