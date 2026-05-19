
import React, { useEffect, useState } from 'react'
import FlashcardListCard from '../FlashcardListCard/FlashcardListCard';
import './FlashcardsListPage.scss';
import flashcardService from '../../../services/flashcardService';
import Button from '../../../components/common/Button/Button';
import { useNavigate } from 'react-router';
import Spinner from '../../../components/common/Spinner/Spinner';
import { BookOpenCheck } from 'lucide-react';
const FlashcardsListPage = () => {
  const [cardList , setCardList] = useState([]);
  const [loading , setLoading] = useState(true);
const navigate = useNavigate()
const fetchAllCards = async()=> {
  setLoading(true);
  try{
    const response = await flashcardService.getAllFlashcardSets();
    setCardList(response.data);
    console.log('count: ',response?.count);
    setLoading(false)
  }catch(error){
    console.error('Failed to load flashcards list');
  }finally{
    setLoading(false);
  }
}

useEffect(()=> {
fetchAllCards();
},[])
console.log('all cards: ',cardList);
  return (
    <div className='flashcardList-page'>
      <div className='flashcardList-page__header'>
      <h2 className='flashcardList-page--header'>My FLashcards</h2>
      <p className='flashcardList-page--text'>Master your materials one card at a time. 
        Track your progress, review difficult concepts,
         and build your knowledge base</p>
      </div>
        {loading ? (
      <Spinner/>
        
    ) : (!cardList || cardList.length === 0) ? (
      <div className='flashcardList-page__empty-page'>
        <div className='empty-documents-container__icon-wrapper'>
        <BookOpenCheck color='#fff'/>
        </div>
        <h2>No flashcards generated</h2>
        <p>Click the link below to navigate to document tab</p>
        <Button onClick={() => navigate('/documents')}>Go to documents</Button>
      </div>
    ) : (
      <div className='flashcardList-page__grid-holder'>
        {cardList.map((card, index) => (
          <div key={index}>
            <FlashcardListCard card={card} index={index} />
          </div>
        ))}
      </div>
    )}
 
    </div>
  )
}

export default FlashcardsListPage
