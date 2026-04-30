import React, { useEffect } from 'react';
import { Brain, BrainCircuit, Clock, CloudLightning, GitGraph, Play, Trash2 } from 'lucide-react'; 
import './QuizCard.scss';
import {  useNavigate, useParams } from 'react-router';


const QuizCard = ({ card, onDelete, index , documentId}) => {
    const {id} = useParams();
/*   const handleDelete = (e) => {
    e.stopPropagation(); 
    onDelete(card._id);
  };
  
  const navigate = useNavigate();

function formatTime(dateInput) {
  const date = new Date(dateInput);

  console.log('main id:', id);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',   
    day: 'numeric',   
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
 }

const handleNavigate = () => {
  navigate(`/documents/${documentId}/flashcards/${card._id}`);
} */
  return (
    <div className='quiz-card'>
      <div className='quiz-card__flex'>
        <div className='quiz-card__icon-holder'>
          <div className='quiz-card__score-wrapper'>
           <CloudLightning size={15}/> score: {0}
          </div>
        </div>
        
        <div className='quiz-card__text-details'>
          <p className='quiz-card__title'>React js Concept guide - Quiz</p>
        </div>
       <div className='quiz-card__created-time'>
            <span>{ "Created November 20 2025"} </span> 
       </div>
        <div>
          <div className='quiz-card__question-holder'>
            <p>5 questions</p>
          </div>
        </div>
        <div className='quiz-card__footer'>
            <button className='quiz-card__start-btn'><Play size={20}/> Take quiz</button>
        </div>
      </div>

      <button className='quiz-card__delete' >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default QuizCard;