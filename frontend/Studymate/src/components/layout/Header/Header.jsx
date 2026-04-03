import React from 'react'
import './Header.scss'
import { useAuth } from '../../../context/AuthContext'
import { Bell,User, Menu  } from 'lucide-react'
const Header = () => {
    const {user} = useAuth();
    const userProfile = {
        email: user?.email || "user@gmail.com",
        username: user?.username || "user"
    }
    console.log(user)
  return (
    <div className='header'>
        <div className='header__bell'>
            <Bell className='bell-icon' strokeWidth={2}/>
            <span className='notification-dot'></span>
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
