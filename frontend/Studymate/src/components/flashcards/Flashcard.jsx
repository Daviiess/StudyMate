import React, { useEffect } from 'react';
import { Brain, BrainCircuit, Clock, Trash2 } from 'lucide-react'; 
import './Flashcard.scss'
import { formatTime } from '../../utils/util';
import {  useNavigate, useParams } from 'react-router';


const Flashcard = ({ card, onDelete, index , documentId}) => {
    const {id} = useParams();
  const handleDelete = (e) => {
    e.stopPropagation(); 
    onDelete(card._id);
  };
  
  const navigate = useNavigate();


const handleNavigate = () => {
  navigate(`/documents/${documentId}/flashcards/${card._id}`);
}
  return (
    <div className='flashcard'>
      <div onClick={handleNavigate} className='flashcard__flex'>
        <div className='flashcard__icon-holder'>
          <div className='flashcard__icon-wrapper'>
            <Brain size={35}/>
          </div>
        </div>
        
        <div className='flashcard__text-details'>
          
          <p className='flashcard__title'>Flashcard set {index}</p>
        </div>
       <div className='flashcard__footer-items'>
            <Clock size={15}/> 
            <span>Created {formatTime(card.createdAt) ? formatTime(card.createdAt) : "Nil"}</span> 
          </div>
        <div className='flashcard__footer'>
          <div className='flashcard__set-holder'>
            <p>{card.cards.length} cards</p>
          </div>
        </div>
      </div>

      <button className='flashcard__delete' onClick={handleDelete}>
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default Flashcard;