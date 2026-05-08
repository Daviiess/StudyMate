import React, { useEffect } from 'react';
import { Brain, BrainCircuit, Clock, CloudLightning, GitGraph, Play, Trash2 } from 'lucide-react'; 
import './QuizCard.scss';
import {  useNavigate, useParams } from 'react-router';
import { formatTime } from '../../utils/util';
import { truncateTitle } from '../../utils/util';
import { useQuiz } from '../../context/QuizContext';
const QuizCard = ({ quiz, index, onDelete }) => {
    const {id} = useParams();
    const handleDelete = (e) => {
      e.stopPropagation();
      onDelete(quiz);
    }
    const {isFinished} = useQuiz();
    console.log(isFinished);
const navigate = useNavigate();
const handleNavigate = () => {
  navigate(`/quizzes/${quiz?._id}`);
} 

  return (
    <div className='quiz-card'>
      <div className='quiz-card__flex'>
        <div className='quiz-card__icon-holder'>
          <div className='quiz-card__score-wrapper'>
            <CloudLightning size={15}/>
            {quiz?.completedAt 
                ? `Score: ${quiz?.score}%` 
                : 'Not attempted'
            }
        </div>
        </div>
        
        <div className='quiz-card__text-details'>
          <p className='quiz-card__title'>{truncateTitle(quiz?.title)}Quiz - {index}</p>
        </div>
       <div className='quiz-card__created-time'>
            <span> {formatTime(quiz?.createdAt)} </span> 
       </div>
        <div>
          <div className='quiz-card__question-holder'>
            <p>{quiz?.totalQuestions} questions</p>
          </div>
        </div>
        <div className='quiz-card__footer'>
         {quiz?.completedAt 
    ? <button className='quiz-card__start-btn'
     onClick={() => navigate(`/quizzes/${quiz._id}/results`)}>
        View Result
      </button> 
    : <button className='quiz-card__start-btn' onClick={handleNavigate}>
        <Play size={20}/> Take Quiz
      </button>
}
        </div>
      </div>

      <button className='quiz-card__delete' >
        <Trash2 size={20} onClick={handleDelete}/>
      </button>
    </div>
  );
};

export default QuizCard;