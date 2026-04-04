import React from 'react'
import { TrendingUp } from 'lucide-react'
import './EmptyDashboard.scss'
const EmptyDashboard = () => {
  return (
    <div className="empty-state-container">
         <div className="empty-state-container__content">
           <div className="empty-state-container__icon-box">
             <TrendingUp className="empty-state-container__icon" />
           </div>
           <p className="empty-state-container__text">
             No dashboard data available.
           </p>
         </div>
       </div>

  )
}

export default EmptyDashboard
