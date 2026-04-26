import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Note: react-router-dom
import { useStudy } from "../../../context/StudyContext";
import {
  ChevronLeft,
  ChevronRight,
  LucideChevronLeftSquare,
  Rotate3DIcon,
  Star,
  BrainCircuit
} from "lucide-react";
import './FlashcardsPage.scss';

const FlashcardPage = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { getFlashcardSet,deck, handleNextCard,
     currentIndex, handlePrevCard, handleReview } = useStudy();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (setId) {
      getFlashcardSet(setId);
    }
  }, [setId]);

   console.log('deck cards: ', deck.cards) 
   console.log('deck: ', deck) 
  /* console.log('deck', deck?.cards?.[1]?.question); */
  const handleReviewCard = () => {

    handleReview( cardId = deck?.cards[currentIndex]._id, setId = deck._id, )
  }
  return (
    <div className="flashcard-page">
      <div className="flashcard-page__header">
         <button
          onClick={() => navigate(-1)}
          className="flashcard-page__exit-btn"
        >
          <LucideChevronLeftSquare />
          Back to Sets
        </button> 
      </div>

      <div className="flashcard-page__main-container">
        
       
        <div className="flashcard-page__scene">
          <div 
            className={`flashcard-page__card-inner ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            
            <div className="flashcard-page__card-side flashcard-page__card-side--front">
                <div className="flashcard-watermark">
                    <BrainCircuit size={180} />
                </div>
              <div className="flashcard-page__card-details">
                <span>Easy</span>
               <button className="flashcard-page__star-btn"
               onClick={(e) => {
                    e.stopPropagation();
               }}   
               > 
                <Star size={20} />
                </button>
              </div>
              <div className="flashcard-page__content">
                {deck?.cards?.[currentIndex]?.question}
               
              </div>
              <span className="flashcard-page__hint"><Rotate3DIcon size={12}/>Click to see answer</span>
            </div>
            <div className="flashcard-page__card-side flashcard-page__card-side--back">
              <div className="flashcard-page__content">
                {deck?.cards?.[currentIndex]?.answer}
              </div>
              <span className="flashcard-page__hint"> <Rotate3DIcon size={12}/> Click to see question</span>
            </div>
          </div>
        </div>

        
        <div className="flashcard-page__action-holder">
          <button className="nav-btn"
          onClick={handlePrevCard}
          disabled = {currentIndex < 1}
          >
            <ChevronLeft /> Prev
          </button>
          <span> {currentIndex + 1} / {deck?.cards?.length}</span>
          <button className="nav-btn"
          onClick={handleReviewCard}
          disabled = { currentIndex >= deck?.cards?.length - 1}
          >
            Next <ChevronRight />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FlashcardPage;