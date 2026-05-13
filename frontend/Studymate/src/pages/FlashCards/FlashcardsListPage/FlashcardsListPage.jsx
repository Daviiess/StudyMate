
import React, { useEffect, useState } from 'react'
import FlashcardListCard from '../FlashcardListCard/FlashcardListCard';
import './FlashcardsListPage.scss';
import flashcardService from '../../../services/flashcardService';
import { useStudy } from '../../../context/StudyContext';
const FlashcardsListPage = () => {
  const [cardList , setCardList] = useState([]);
  const [loading , setLoading] = useState(false);
 const {totalCards} = useStudy();
 console.log('total',totalCards);
  const arr = [
  {id: 1, text: 'rat'},
  {id: 2, text: 'cat'},
  {id: 3, text: 'tat'},
  {id: 4, text: 'fat'},
  {id: 5, text: 'bat'},
]
console.log('documentID', cardList[0]?.documentId?._id)
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
      <div className='flashcardList-page__grid-holder'>
      {cardList?.map((card, index) => {
      return(
        <div key={index}>
        <FlashcardListCard card = {card} index = {index} />
        </div>
      )
        })}
      </div>
 
    </div>
  )
}

export default FlashcardsListPage
