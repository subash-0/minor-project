import React, { useEffect } from 'react'
import { Button } from './button'
import { LogOut, SidebarOpen } from 'lucide-react'
import {handleLogout} from "../utils/api/Fetcher";
import { useNavigate } from 'react-router-dom';
interface TopBarProps {
  setSideBar: (value: boolean) => void
}

const TopBar: React.FC<TopBarProps> = ({ setSideBar }) => {
  const navigate = useNavigate()

      
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className='flex items-center'>
            <img src="/vite.ico" alt="3S Logo" className="h-12 w-auto rounded-full" />
            <h1 className="text-2xl font-bold hidden text-gray-900 sm:block">3S Colorizer</h1>
          </div>
          <Button variant="outline" onClick={() => setSideBar(prev => !prev)}
            className='sm:hidden'>
            <SidebarOpen className='h-4 w-4' /> </Button>
          <Button variant="outline" onClick={()=>handleLogout(navigate)}><LogOut className='sm:mr-2 h-4 w-4' /> <span className='hidden sm:block'>Log Out</span> </Button>
        </div>
      </div>
    </header>
  )
}

export default TopBar

