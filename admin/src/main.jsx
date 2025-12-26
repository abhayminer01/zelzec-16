import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ManageAdmins from './pages/ManageAdmins'
import NoPage from './pages/NoPage'
import ManageCategories from './pages/ManageCategories'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <Login /> }/>
        <Route path='*' element = { <NoPage /> }/>
        <Route path='dashboard' element = { <Dashboard /> } />
        <Route path='dashboard/admins' element = { <ManageAdmins /> } />
        <Route path='dashboard/categories' element = { <ManageCategories /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
