import React, { useEffect, useState } from 'react'
import Spinner from '../../components/common/Spinner/Spinner.jsx';
import progressService from '../../services/progressService.js';
import toast from 'react-hot-toast';
import { FileText, BrainCircuit, TrendingUp, Clock } from 'lucide-react';
import './Dashboard.scss';


const DashBoardPage = () => {
  const [dashboardData , setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      /* if (loading || !localStorage.getItem('token')) return; */
      try{
        const response = await progressService.getDashboardData();
        console.log("Data__getDashBoard data: ", response.data)
        setDashboardData(response.data);
        /*  console.log("Data__getDashBoard data: ", dashboardData); */
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

  if(!dashboardData ||  !dashboardData.overview){
   return (
    <div>
      <div>
        <div>
          <TrendingUp/>
        </div>
        <p>No dashboard data available</p>
      </div>
    </div>
   )
  }

  return (
    <div className='dashboard'>
      dashboard page
    </div>
  )
}

export default DashBoardPage
