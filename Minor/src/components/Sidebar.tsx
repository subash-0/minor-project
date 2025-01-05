import React, { useEffect } from 'react'
import { Button } from './button'
import { History, SidebarClose } from 'lucide-react'

interface SidebarProps {
    isSidebar: boolean,
    setSidebar: (value: boolean) => void
    }

const Sidebar: React.FC<SidebarProps> = ({isSidebar, setSidebar}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSidebar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, setSidebar])
  
  return (
    <div className={`bg-gray-800 text-white w-64 h-[100vh] space-y-6 py-7 px-2 sm:opacity-100 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-md ${isSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`} ref={ref}> 
      <nav >
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700 mb-4">
          <History className="mr-2 h-4 w-4" /> Your History
        </Button>
        <Button variant="ghost" className="w-fit justify-start text-white hover:bg-gray-700 mb-4 absolute top-0 right-2 sm:hidden" onClick={()=>setSidebar(!isSidebar)} > <SidebarClose className="h-4 w-4" /> </Button>
      </nav>
    </div>
  )
}

export default Sidebar

