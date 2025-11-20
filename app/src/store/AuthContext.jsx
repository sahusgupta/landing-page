import React, { createContext, useEffect, useState } from 'react'

const AUTH_KEY = 'portfolioAuth_v1'
const CRED_KEY = 'portfolioCreds_v1'
export const AuthContext = createContext()

async function sha256(str){
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(str))
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
}

export function AuthProvider({children}){
  const [isAuthenticated, setIsAuthenticated] = useState(()=>{
    try{ return !!localStorage.getItem(AUTH_KEY) }catch(e){ return false }
  })

  useEffect(()=>{
    // no-op
  },[])

  async function login(username, password){
    try{
      const rawCred = localStorage.getItem(CRED_KEY)
      if(!rawCred) return false
      const cred = JSON.parse(rawCred)
      const pwHash = await sha256(password+username)
      if(pwHash === cred.hash && username === cred.user){
        localStorage.setItem(AUTH_KEY, JSON.stringify({user:username,ts:Date.now()}))
        setIsAuthenticated(true)
        return true
      }
      return false
    }catch(e){ console.error(e); return false }
  }

  async function setupCredentials(username, password){
    try{
      const hash = await sha256(password+username)
      localStorage.setItem(CRED_KEY, JSON.stringify({user:username,hash}))
      // auto-login after setup
      localStorage.setItem(AUTH_KEY, JSON.stringify({user:username,ts:Date.now()}))
      setIsAuthenticated(true)
      return true
    }catch(e){ console.error(e); return false }
  }

  function logout(){
    try{ localStorage.removeItem(AUTH_KEY); setIsAuthenticated(false) }catch(e){}
  }

  function hasCredentials(){ try{ return !!localStorage.getItem(CRED_KEY) }catch(e){ return false } }

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout, setupCredentials, hasCredentials}}>
      {children}
    </AuthContext.Provider>
  )
}
