import React, { useEffect } from 'react'
import { Navigate, Route } from 'react-router'
import { Routes } from 'react-router'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Chat from './pages/Chat'
import { useAuthStore } from './store/useAuthStore'
import PageLoader from './components/PageLoader'
import { Toaster } from 'sonner'

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth) return <PageLoader />

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      <Toaster richColors position='top-center'  />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <Routes>
        <Route path='/' element={authUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path='/sign-up' element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
      </Routes>
    </div>
  )
}

export default App