import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../store/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const { login, setupCredentials, hasCredentials, isAuthenticated } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSetup, setIsSetup] = useState(true)
  const nav = useNavigate()

  useEffect(()=>{ setIsSetup(!hasCredentials()) }, [hasCredentials])
  useEffect(()=>{ if(isAuthenticated) nav('/admin') }, [isAuthenticated, nav])

  async function handleSubmit(e){
    e.preventDefault()
    if(isSetup){
      if(!username||!password){ alert('Enter username and password'); return }
      const ok = await setupCredentials(username.trim(), password)
      if(ok){ alert('Admin credentials set. You are logged in.'); nav('/admin') }
      else alert('Failed to setup credentials')
    }else{
      const ok = await login(username.trim(), password)
      if(ok){ nav('/admin') } else { alert('Login failed') }
    }
  }

  return (
    <section>
      <h1>{isSetup ? 'Set Admin Credentials' : 'Admin Login'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button className="btn primary" type="submit">{isSetup ? 'Set Credentials' : 'Login'}</button>
      </form>
      {isSetup ? <p className="small">This is first-time setup. Choose a username and password. They are stored (hashed) in your browser localStorage.</p> : <p className="small">Enter your admin username and password to continue.</p>}
    </section>
  )
}
