import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

function Root(){
  useEffect(()=>{
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true })
  },[])
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
