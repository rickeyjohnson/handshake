import React from 'react'
import { Routes, Route } from 'react-router'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<p>handshake</p>}/>
    </Routes>
  )
}

export default App