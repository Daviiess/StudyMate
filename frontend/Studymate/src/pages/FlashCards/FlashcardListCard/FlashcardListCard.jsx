import React from 'react';
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import './flashcardListCard.scss';

const FlashcardListCard = ({ 
  title = "React JS Concept Guide", 
  timeAgo = "6 MINUTES AGO", 
  totalCards = 10, 
  masteryScore = 50, 
  reviewedCards = 5 
}) => {
  // Calculate the progress bar width dynamically
  const progressPercentage = (reviewedCards / totalCards) * 100;

  return (
    <div className="study-card">
      
      {/* Header Section */}
      <div className="study-card__header">
        <div className="study-card__icon-box">
          <BookOpen size={24} />
        </div>
        <div className="study-card__header-info">
          <h3 className="study-card__title">{title}</h3>
          <p className="study-card__time">CREATED {timeAgo}</p>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="study-card__stats">
        <div className="study-card__pill study-card__pill--neutral">
          <span>{totalCards} Cards</span>
        </div>
        <div className="study-card__pill study-card__pill--success">
          <TrendingUp size={16} strokeWidth={2.5} />
          <span>{masteryScore}%</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="study-card__progress-section">
        <div className="study-card__progress-header">
          <span className="study-card__progress-label">Progress</span>
          <span className="study-card__progress-text">{reviewedCards}/{totalCards} reviewed</span>
        </div>
        <div className="study-card__progress-track">
          <div 
            className="study-card__progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <button className="study-card__btn">
        <Sparkles size={18} />
        <span>Study Now</span>
      </button>

    </div>
  );
};

export default FlashcardListCard;