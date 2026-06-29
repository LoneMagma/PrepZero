import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// No StrictMode — MediaRecorder and AudioContext break with double-invocation
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
