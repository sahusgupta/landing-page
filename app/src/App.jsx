import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import { PortfolioProvider } from './store/PortfolioContext'
import { AuthProvider, AuthContext } from './store/AuthContext'
import { useContext } from 'react'

export default function App(){
  return (
    <AuthProvider>
      <PortfolioProvider>
      <Header />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/resume" element={<Resume/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </main>
      </PortfolioProvider>
    </AuthProvider>
  )
}

function ProtectedAdmin({children}){
  // simple wrapper to redirect to /login when not authenticated
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = window.location;
  if(!isAuthenticated){
    // client-side redirect
    window.location.href = '/login'
    return null
  }
  return children
}

function Header(){
  const { isAuthenticated, logout } = React.useContext(AuthContext)
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">S.G{/* replace with site/owner name */}</Link>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/contact">Contact</Link>
          {!isAuthenticated && <Link to="/login">Login</Link>}
        </nav>
      </div>
    </header>
  )
}



