import React from 'react'
import './Sidebar.scss';
import logo from '../../../assets/logo1.png';
import { LayoutDashboard, FileText, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
     const {logout}  = useAuth(); 
    const navigate = useNavigate();
     const handleLogout = () => {
        logout();
        
    } 
    const navLinks = [
        {to: '/dashboard' , icon: LayoutDashboard, text: 'Dashboard'},
        {to: '/documents' , icon: FileText,        text: 'Document'},
        {to: '/flashcards', icon: BookOpen,        text: 'Flashcards'},
        {to: '/profile'   , icon: User,            text: 'Profile'}

    ];
  return (
    <div className='sidebar'>
        <div className='sidebar__header'>
           <div className='sidebar__header--img-holder'>
            <img src={logo} alt="" className='sidebar__img' />
          </div>
          <span className='sidebar__span'>Ai powered study companion</span> 
        </div>
      <ul className='sidebar__holder'>
        {navLinks.map((link) => {
           return(
            <li key={link.text} className='sidebar__links'>
            <NavLink to={link.to}
            className={({isActive}) => `sidebar__navLinks ${isActive ? 'sidebar__navLinks--active' : ''}`}
            >
            <link.icon/>
            <span>{link.text} </span>
            </NavLink>
            </li>
           ) 
        })}
      </ul>

      <div>
        <button onClick={handleLogout}>
            logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar;
