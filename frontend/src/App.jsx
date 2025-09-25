import React from 'react'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Chat from './pages/Chat'
import { useAuthStore } from './store/useAuthStore'

const App = () => {
  const {authUse,isLoading,login} = useAuthStore()
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App