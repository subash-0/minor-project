import React, { useContext, useEffect } from 'react'
import { Button } from './button'
import { History, SidebarClose, Trash } from 'lucide-react'
import { deleteHistory } from '../utils/api/Colorize'

import ManageContext from "../utils/context/ManageContext"

interface SidebarProps {
  isSidebar: boolean,
  setSidebar: (value: boolean) => void,
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebar, setSidebar }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { manage, setManage } = useContext(ManageContext)

  // Handle clicking outside to close sidebar
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

  // setId for the selected image
  const handleSetId = ({ id }: { id: string }, {orgId}:{orgId:string}) => {
    
    setManage({ ...manage, id,orgId })
  }

  useEffect(() => {
    console.log('manage', manage)
  }, [manage])

  // Handle deletion of an item
  const handleDelete = async ({ id }: { id: string }) => {
    const data = await deleteHistory(id)
    if (data) {
      // Remove the deleted item from the context history state directly
      setManage(prevManage => ({
        ...prevManage,
        history: prevManage.history.filter(item => item?.bwImage?._id !== id)
      }))
    }
  }

  return (
    <div
      className={`bg-gray-800 text-white w-64 h-[100vh] space-y-6 py-7 px-2 sm:opacity-100 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-md ${isSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
      ref={ref}
    >
      <nav>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700 mb-4 text-xl">
          <History className="mr-2 h-4 w-4" /> Your History
        </Button>

        {/* Render the history items */}
        {manage.history.map((item, index) => (
          <Button key={index} className="text-sm rounded-md w-full py-2 px-4 text-left hover:bg-gray-700" onClick={() => handleSetId({ id: item?._id },{orgId:item?.bwImage?._id})}>
           <span className="text-left truncate w-[35ch] max-w-full">{item?.bwImage?.label}</span>

            <Trash onClick={() => handleDelete({ id: item?.bwImage?._id })} className='w-5 h-5 hover:text-red-700 z-50' />
          </Button>
        ))}

        <Button variant="ghost" className="w-fit justify-start text-white hover:bg-gray-700 mb-4 absolute top-0 right-2 sm:hidden" onClick={() => setSidebar(!isSidebar)}>
          <SidebarClose className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  )
}

export default Sidebar
