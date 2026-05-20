import React from 'react';
import { BookOpen, TrendingUp, Sparkles, StarsIcon, StarIcon } from 'lucide-react';
import './flashcardListCard.scss';
import { useNavigate } from 'react-router';
import { formatTimeAgo, truncateTitle } from '../../../utils/util';

const FlashcardListCard = ({card}) => {
   const progressPercentage = (card?.reviewedCardsCount / card?.totalCards) * 100;
   const masteryScore = (card?.masteredCount / card?.totalCards ) * 100;
   const navigate = useNavigate();
   let documentId = card?.documentId._id;
   let title = truncateTitle(card?.documentId?.title)
   let time = formatTimeAgo(card?.createdAt);
console.log('card', card);
  const handleNavigate = () => {
  navigate(`/documents/${documentId}/flashcards/${card._id}`);
  }

  return (
    <div className="study-card">
      
      {/* Header Section */}
      <div className="study-card__header">
        <div className="study-card__icon-box">
          <BookOpen size={24} />
        </div>
        <div className="study-card__header-info">
          <h3 className="study-card__title">{title}</h3>
          <p className="study-card__time">CREATED {time}</p>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="study-card__stats">
        <div className="study-card__pill study-card__pill--neutral">
          <span className='spanny'>{card?.totalCards} Cards</span>
        </div>
        <div className="study-card__pill study-card__pill--success">
          <TrendingUp size={16} strokeWidth={2.5} />
          <span>{masteryScore}%</span>
        </div>
        <div className='study-card__pill study-card__pill--starred'>
        <StarIcon fill='gold'color='#fff'/>
        <span>{card?.starredCount}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="study-card__progress-section">
        <div className="study-card__progress-header">
          <span className="study-card__progress-label">Progress</span>
          <span className="study-card__progress-text">{card?.reviewedCardsCount } / {card?.totalCards} reviewed</span>
        </div>
        <div className="study-card__progress-track">
          <div 
            className="study-card__progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <button className="study-card__btn" onClick={handleNavigate}>
        <Sparkles size={18} />
        <span>Study Now</span>
      </button>

    </div>
  );
};

export default FlashcardListCard;