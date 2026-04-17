import React from 'react';
import './Ai_Actions.scss';
import { Book } from 'lucide-react';
import logo from '../../assets/logo1.png';
const Ai_Actions = () => {
  return (
    <div className='ai-actions'>
        <div className='ai-actions__holder'>
      <div className='ai-actions__header-logo'>
         <img src={logo} alt="" className='ai-actions__logo'/> 
      </div>

      <div>
        <p className='ai-actions__logo-title'>StudyMate</p>
        <p className='ai-actions__logo-text '>Powered by advance ai</p>
    </div>
    </div>
     
    </div>
  )
} 

export default Ai_Actions
