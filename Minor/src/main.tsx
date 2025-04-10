import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {ManageProvider} from "./utils/context/ManageContext"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ManageProvider>
      <App />
    </ManageProvider>
   
  </StrictMode>,
)
