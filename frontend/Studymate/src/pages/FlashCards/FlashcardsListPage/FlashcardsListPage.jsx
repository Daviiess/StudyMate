/* import React, { useEffect } from 'react'
import {useParams} from 'react-router-dom';
import { useStudy } from '../../../context/StudyContext';
import './FlashcardsListPage.scss';
import { BrainCircuit, Sparkles } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Flashcard from '../../../components/flashcards/Flashcard';
const FlashcardsListPage = () => {
  const {id: documentId} = useParams();
  const {generateDeck , isLoading, deck, loadDeck} = useStudy()
 
  const handleCardGeneration = () => {
    generateDeck(documentId);
  }

  useEffect(() => {
    if(documentId){
      loadDeck(documentId);
    }
  }, loadDeck, deck)
  console.log('deck: ', deck );
  
  const EmptyDeckIllustration = () => (
  <svg 
    width="160" 
    height="160" 
    viewBox="0 0 160 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    
    <circle cx="80" cy="80" r="60" fill="#F3E8FF" />
    <rect x="55" y="45" width="60" height="80" rx="8" transform="rotate(15 55 45)" fill="#DDD6FE" />
    <rect x="45" y="35" width="60" height="80" rx="8" transform="rotate(-5 45 35)" fill="#C4B5FD" stroke="#F3E8FF" strokeWidth="2" />
    <rect x="50" y="50" width="60" height="80" rx="8" fill="#8B5CF6" stroke="white" strokeWidth="3" shadow="sm" />
    <rect x="60" y="65" width="40" height="4" rx="2" fill="white" opacity="0.8" />
    <rect x="60" y="75" width="30" height="4" rx="2" fill="white" opacity="0.8" />
    <rect x="60" y="85" width="35" height="4" rx="2" fill="white" opacity="0.8" />
    <path d="M115 35L117 42L124 44L117 46L115 53L113 46L106 44L113 42L115 35Z" fill="#8B5CF6" />
    <path d="M35 105L36.5 110L41.5 111.5L36.5 113L35 118L33.5 113L28.5 111.5L33.5 110L35 105Z" fill="#C4B5FD" />
    <path d="M125 100L126 103L129 104L126 105L125 108L124 105L121 104L124 103L125 100Z" fill="#8B5CF6" />
  </svg>
);


  function EmptyFlashcard(){
    if(dummy.length <= 0){
      return(
        <div className='empty-flashcard'>
            <div className='empty-flashcard__icon-holder'>
              <EmptyDeckIllustration/>
            </div>
            <h2>No Flashcards generated</h2>
            <p>Generate flashcards from your document to start learning and reinforce your knowledge</p>
           <div>
            
             <Button disabled = {isLoading} onClick={handleCardGeneration}>
              {isLoading ? 
              <>
              <div className='loading-spinner'/>
              Generating...
              
              </>
              : <>
              <Sparkles fill='gold' size={20}/>Generate Flashcards
              </>
              }
             </Button>
           </div>
        </div>
      )
    }
  }
const dummy = [
  {_id: '1' , question: 'What is React?', answer: 'A UI library', hint: 'Facebook made it'},
                { _id: '2', question: 'What is a Reducer?', answer: 'A state management function', hint: 'Think of Redux' },
                { _id: '3', question: 'What is a Redux?', answer: 'Another state management function', hint: 'Think of Redux' },
                { _id: '4', question: 'What is a React?', answer: 'A framework', hint: 'Think of Redux' },
                { _id: '5', question: 'What is a js?', answer: 'A prog language', hint: 'Think of Redux' },
                { _id: '6', question: 'What is a python?', answer: 'Another prog language', hint: 'Think of Redux' },
                { _id: '7', question: 'What is a rat?', answer: 'An animal', hint: 'Think of Redux' },
]
  return (
    <div className='flashcard-list'>
      { <EmptyFlashcard/>}
      <div className='flashcard-list__grid-holder'>
      {deck.map((card, index) => {
        return( <Flashcard card={card} key={card._id} 
          index={index} documentId = {documentId}/>)
      })}
      </div>
    </div>
  )
}

export default FlashcardsListPage
 */
import React from 'react'

const FlashcardsListPage = () => {
  return (
    <div>
      flashcard list page
    </div>
  )
}

export default FlashcardsListPage
