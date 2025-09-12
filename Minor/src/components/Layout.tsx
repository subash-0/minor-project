import React from 'react'
import TopBar from './Topbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebar={isSidebarOpen} setSidebar={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar setSideBar={setIsSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

