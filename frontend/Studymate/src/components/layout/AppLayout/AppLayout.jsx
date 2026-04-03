import React from 'react';
import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Header from '../Header/Header.jsx';
import './AppLayout.scss'
const AppLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(sidebarOpen => !sidebarOpen)
  }
  return (
    <div className='app-layout'>
      <Sidebar isSidebarOpen = {isSidebarOpen} toggleSidebar = {toggleSidebar}/>
      <div className='app-layout__content'>
        <Header/>
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout;
