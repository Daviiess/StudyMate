
import React, { useEffect, useState } from 'react'
import FlashcardListCard from '../FlashcardListCard/FlashcardListCard';
import './FlashcardsListPage.scss';
import flashcardService from '../../../services/flashcardService';
import { useStudy } from '../../../context/StudyContext';
import Button from '../../../components/common/Button/Button';
import { useNavigate } from 'react-router';
const FlashcardsListPage = () => {
  const [cardList , setCardList] = useState([]);
  const [loading , setLoading] = useState(false);
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
  }
}
function EmptyFlashcard(){
  if(!cardList || cardList?.length){
    <div>
      No flashcards generated
    </div>
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
    { (cardList.length === 0 || !cardList) ?
      <div className='flashcardList-page__empty-page'> 
       <h2>No flashcards generated</h2>
       <p>Click the link below to navigate to document tab</p>
       <Button onClick={() => {
        navigate('/documents')
       }}>Go to documents</Button>
        </div>
        : <div className='flashcardList-page__grid-holder'>
      {cardList?.map((card, index) => {
      return(
        <div key={index}>
        <FlashcardListCard card = {card} index = {index} />
        </div>
      )
        })}
      </div> 
        }
 
    </div>
  )
}

export default FlashcardsListPage
