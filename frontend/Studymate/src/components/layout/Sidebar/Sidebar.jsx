import React from 'react'
import './Sidebar.scss';
import logo from '../../../assets/logo1.png';
import { LayoutDashboard, FileText, BookOpen, User, LogOut, BrainCircuitIcon, Brain } from 'lucide-react';
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
      <div className='sidebar__logo-group'>
        <div className='sidebar__logo-icon'>
          {/* Increased size, white color, thicker stroke */}
          <Brain size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div className='sidebar__logo-text'>
          <span className='sidebar__title'>StudyMate</span>
          <span className='sidebar__badge'>AI Tutor</span>
        </div>
      </div>
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

      <div className='sidebar__logout-holder'>
        <button onClick={handleLogout} className='sidebar__logout-holder--btn'>
           <LogOut/> logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar;
