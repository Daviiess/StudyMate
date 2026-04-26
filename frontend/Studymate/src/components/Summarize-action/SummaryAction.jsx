import React, { useEffect, useState } from 'react';
import './SummaryAction.scss';
import aiService from '../../services/aiService';
import { useParams } from 'react-router';
import MarkdownRenderer from '../common/MarkdownRenderer/MarkdownRenderer.jsx'
import StudyCard from '../common/StudyCard/StudyCard.jsx';
import { X } from 'lucide-react';
import Spinner from '../common/Spinner/Spinner.jsx';
import toast from 'react-hot-toast';
const SummaryAction = ({toggleSummary}) => {
    const [summary , setSummary] = useState(null);
    const {id: documentId} = useParams();
    const [loading , setIsLoading] = useState(false);
    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true)
            try{
              const response = await aiService.generateSummary(documentId);
              console.log('summary response: ', response);
              setSummary(response);
            } catch(error){
                 toast.error(error.message || 'Failed to generate summary.');   
            }finally{
                setIsLoading(false)
            }
        }
            fetchSummary()
    },[])
      
    console.log('summ:',typeof(summary))
    console.log('summary: ' , summary);
  return (
    <div className='summary-action'>
        <div className='summary-action__overlay'>
            <div className='summary-action__header'>
                <h3 className='summary-action__title'>{summary?.title || 'Document title'}</h3>
                <div className='summary-action__divider'/>
            </div>
            <div className='summary-action__body'>
              {loading ? <div className='summary-action__loading'> 
                <span>summary loading...</span>
                <div className='loading-chat__animation' style={{ margin: 0 }}>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                </div>
              </div>
               :<StudyCard document={summary}/>  }
            </div>
            <button className='summary-action__cancel-btn'
            onClick={toggleSummary}
            ><X/></button>
        </div>
    </div>
  )
}

export default SummaryAction
