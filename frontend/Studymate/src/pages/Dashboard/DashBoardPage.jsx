import React, { useEffect, useState } from 'react'
import Spinner from '../../components/common/Spinner/Spinner.jsx';
import progressService from '../../services/progressService.js';
import toast from 'react-hot-toast';
import { FileText, BrainCircuit, TrendingUp, Clock, BookOpen, CalendarDays } from 'lucide-react';
import './Dashboard.scss';
import EmptyDashboard from '../../components/common/EmptyDashboard/EmptyDashboard.jsx';
import { Link, NavLink, useNavigate,  } from 'react-router';


const DashBoardPage = () => {
  const [dashboardData , setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try{
        const response = await progressService.getDashboardData();
        setLoading(true);
        console.log("response data: ", response.data);
        setDashboardData(response.data);
       
      }catch(error){
        toast.error('Failed to fetch dashboard data');
        console.error(error);
      }finally{
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if(loading){
    return <Spinner/>
  }

if (!dashboardData || !dashboardData?.overview) {
  return (
   <EmptyDashboard/>
  );
}


  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      content: 'documents'
    },
    
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      content: 'flashcards'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      content: 'quizzes'
    }

  ];

const activities = [
  ...(dashboardData?.recentActivity?.documents || []).map((doc) => ({
    id: doc._id,
    description: doc.title,
    timestamp: doc.createdAt || doc.uploadDate,
    link:  `/documents/${doc._id}`,
    type: 'document'
  })),
  ...(dashboardData?.recentActivity?.quizzes|| []).map((quiz) => ({
    id: quiz._id,
    description: quiz.title,
    timestamp: quiz.completedAt,
    link: `/quiz/${quiz._id}`,
    type: 'quiz'
  }))
].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
 .slice(0, 8);


  const recentActivity = dashboardData?.recentActivity?.documents;

  return (
    <div className='dashboard'>
      <div className='dashboard__header'>
        <h2 className='dashboard__header--heading'>Dashboard</h2>
        <p className='dashboard__header--text'>Track your learning progress and activity</p>
      </div>
      {/* Dashboard stats card */}
      <div className='dashboard__stats'>
        {stats.map((stat) => {
          return(
            <div className='dashboard__card' key={stat.label}>
              <span className='dashboard__card--text'>{stat.label}</span>
              <span className='dashboard__card--value'>{stat.value}</span>

             <div className={`dashboard__card--icon-wrapper dashboard__card--icon-wrapper--${stat.content}`}>
               <stat.icon className='dashboard__card--icon'/>
             </div>

            </div>
          )
        })}
      </div>
      {/* Recent activities */}
      <div className='dashboard__recent-activity'>
        <div className='dashboard__recent-activity--header'>
          <div className='dashboard__recent-activity--icon-wrapper'>
          <span><Clock size={20}/></span>
          </div>
          <span>Recent Activity</span>
        </div>
        { (recentActivity.length === 0 || !recentActivity) ?
              <div className="activity-empty">
            <div className="activity-empty__icon-circle">
              <CalendarDays size={24} /> 
            </div>
            <div className="activity-empty__texts">
              <h4 className="activity-empty__title">No recent activity</h4>
              <p className="activity-empty__subtitle">
                Your latest study progress will be tracked here.
              </p>
            </div>
          </div>
          : <ul className="dashboard__container">
          {activities.map((activity) => {
    
            return (
              <li key={`${activity.type}-${activity.id}`} className='dashboard__documents'>
                <div className='dashboard__activity-info'>
                  <div>
                  <span className={`dashboard-dot dashboard-dot--${activity.type}`} ></span>
                  <span className='dashboard__activity-info--text'> {activity.type === 'document' ? 'Accessed document: ' : 'Accessed quiz: '}  <span className='u-color-grey'>{activity.description}</span> </span>
                  <span className='dashboard__activity-info--date'>
                    {new Date(activity.timestamp).toLocaleString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                      })}
                </span>
                  </div>
                  <div>
                  <span className={`dashboard__view-btn dashboard__view-btn--${activity.type}`}>
                    <Link to={activity.link} className={`dashboard__view-btn-link--${activity.type}`}>
                       view 
                    </Link>
      
                </span>
                </div>
                </div>
               
              </li>
            )
          })}
        </ul>}
      </div>
    </div>
  )
}
 
export default DashBoardPage
