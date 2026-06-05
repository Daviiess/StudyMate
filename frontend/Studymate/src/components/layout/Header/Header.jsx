import React from 'react'
import './Header.scss'
import { useAuth } from '../../../context/AuthContext'
import { Bell,User, Menu, Flame, LogOut } from 'lucide-react'
const Header = ({isSidebarOpen , toggleSidebar}) => {
      const {logout, user}  = useAuth(); 
     const handleLogout = () => {
        logout();
        
    } 

    const userProfile = {
        email: user?.email || "user@gmail.com",
        username: user?.username || "user"
    }
    
  return (
    <div className='header'>
        <button onClick={handleLogout} className='mobile__logout-btn'>
           <LogOut/> 
        </button>
        <Menu onClick={toggleSidebar} className = 'menu-icon' />
        <div className='header__bell'>
            <Flame className='streak-icon' strokeWidth={2} color ='#FF7A00' fill='#FF7A00'/>
            <span className='notification-dot'>{user?.currentStreak}</span>
        </div>
        <div className="header__divider"></div>
        {/* User Profile */}

        <div className='header__profile'>
            <div className='header__profile--icon'>
                <User className='user-icon' strokeWidth={2}/>
                
            </div>
            <div className='header__profile--name'>
                <span className='header__name'>{userProfile.username}</span>
                <span className='header__email'>{userProfile.email}</span>
            </div>
        </div>
    </div>
  )
}

export default Header
