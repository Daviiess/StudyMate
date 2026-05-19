import React from 'react';
import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Header from '../Header/Header.jsx';
import './AppLayout.scss'
import Modal from '../../common/Modal/Modal.jsx';
const AppLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(sidebarOpen => !sidebarOpen)
  }
  return (
    <div className='app-layout'>
      { isSidebarOpen && <Sidebar />}
      <div className='app-layout__content'>
        <Header isSidebarOpen = {isSidebarOpen} toggleSidebar = {toggleSidebar}/>
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout;
