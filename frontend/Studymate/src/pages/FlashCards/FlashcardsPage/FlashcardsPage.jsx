import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Note: react-router-dom
import { useStudy } from "../../../context/StudyContext";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  LucideChevronLeftSquare,
  Rotate3DIcon,
  Star,
  BrainCircuit,
  Trophy,
  RotateCcw
} from "lucide-react";
import './FlashcardsPage.scss';

const FlashcardPage = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const {     
    getFlashcardSet,
    deck,
    handleNextCard,
    handlePrevCard,
    handleReview,
    handleToggleStar,
    currentIndex,
    isLoading,
    isFinished,
    totalCards,} = useStudy();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (setId) {
      getFlashcardSet(setId);
    }
  }, [setId, getFlashcardSet]);

   useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleSmartNext = () => {
    
    if (isFlipped) {
       console.log('cardId:', deck?.cards[currentIndex]._id);
        console.log('setId:', deck._id);
      handleReview(deck._id, deck?.cards[currentIndex]._id);
        
    } else {
        
       setIsFlipped(true)
    }
    
    
}
   if (isLoading) {
    return (
      <div className="flashcard-page flashcard-page--centered">
        <div className="flashcard-page__spinner" />
        <div className="loading-spinner"/>
        <p className="spinner-text">Loading flashcards...</p>
      </div>
    );
  }
   if (!isLoading && !deck?.cards?.length) {
    return (
      <div className="flashcard-page flashcard-page--centered">
        <p>No flashcards found for this set.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
   if (isFinished) {
    toast.success('Cards need to be reviewed 3 times before being mastered');
  const masteredCount = deck.cards.filter(c => c.isMastered).length;
  return (
    
    <div className="flashcard-page flashcard-page--centered">
      <Trophy size={64} className="flashcard-page__finish-icon" />
      <h2 className="flashcard-page__finish-title">Session Complete!</h2>
      <p className="flashcard-page__finish-score">
        <span>{masteredCount}</span> / {totalCards} cards mastered
      </p>
      <div className="flashcard-page__finish-actions">
        <button
          className="nav-btn nav-btn--primary"
          onClick={() => getFlashcardSet(setId)}
        >
          <RotateCcw size={16} /> Restart
        </button>
        <button
          className="nav-btn nav-btn--secondary"
          onClick={() => navigate(-1)}
        >
          Back to Sets
        </button>
      </div>
    </div>
  );
}
  const currentCard = deck?.cards?.[currentIndex];

   console.log('deck cards: ', deck.cards) 

  return (
    <div className="full-page">
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
                <span className={`flashcard-page__difficulty ${currentCard?.isMastered ? 'gold' : ''}`}>{currentCard?.isMastered ? 'Mastered': 'Learning'}</span>
               <button
                  className="flashcard-page__star-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStar(currentCard._id, deck._id);
                  }}
                >
                  {currentCard?.isStarred
                    ? <Star size={20} fill="#FFD700" color="#FFD700" />
                    : <Star size={20} color="currentColor" />
                  }
                </button>
              </div>
              <div className="flashcard-page__content">
                {currentCard?.question}
               
              </div>
              <span className="flashcard-page__hint"><Rotate3DIcon size={12}/>Click to see answer</span>
            </div>
            <div className="flashcard-page__card-side flashcard-page__card-side--back">
              <div className="flashcard-page__content">
                {currentCard?.answer}
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
          onClick={handleSmartNext}
          >
            {isFlipped ? 'Got it': 'Show Answer'}<ChevronRight />
          </button>
        </div>

      </div>
    </div>
    </div>
  );
};

export default FlashcardPage;