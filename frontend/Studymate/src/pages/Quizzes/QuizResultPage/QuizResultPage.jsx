import React from 'react';
import { Trophy, Target, CheckCircle2, XCircle, BookOpen, Check, RotateCcw } from 'lucide-react';
import './QuizResultPage.scss'; 
import { useQuiz } from '../../../context/QuizContext';
import { useParams, useNavigate } from "react-router-dom"; 

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quiz, score, correctCount, userAnswers, totalQuestions, loadQuiz } = useQuiz();

  // derive incorrect and skipped counts
  const incorrect = userAnswers.filter(a => !a.isCorrect).length;
  const skipped = totalQuestions - userAnswers.length;
  const correct = correctCount;

  // score message based on percentage
  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good effort!';
    if (score >= 40) return 'Keep practicing!';
    return 'Don\'t give up!';
  };

  // score color class
  const getScoreClass = () => {
    if (score >= 80) return 'quiz-results__score-value--high';
    if (score >= 60) return 'quiz-results__score-value--mid';
    return 'quiz-results__score-value--low';
  };

  const handleRetry = () => {
    loadQuiz(quizId);
    navigate(`/quizzes/${quizId}`);
  };

  return (
    <div className="quiz-results">

      {/* HEADER */}
      <div className="quiz-results__header">
        <button onClick={() => navigate(-1)}>
          Back to sets
        </button>
        <h2 className="quiz-results__title">{quiz?.title}</h2>
      </div>

      {/* SCORE SUMMARY CARD */}
      <div className="quiz-results__score-card">
        <div className="quiz-results__trophy-wrapper">
          <Trophy size={32} className="quiz-results__trophy-icon" />
        </div>
        <p className="quiz-results__score-label">YOUR SCORE</p>
        <h1 className={`quiz-results__score-value ${getScoreClass()}`}>
          {score}%
        </h1>
        <p className="quiz-results__score-message">{getScoreMessage()}</p>

        <div className="quiz-results__stats-container">
          <div className="quiz-results__stat-pill quiz-results__stat-pill--neutral">
            <Target size={16} />
            <span>{totalQuestions} Total</span>
          </div>
          <div className="quiz-results__stat-pill quiz-results__stat-pill--success">
            <CheckCircle2 size={16} />
            <span>{correct} Correct</span>
          </div>
          <div className="quiz-results__stat-pill quiz-results__stat-pill--danger">
            <XCircle size={16} />
            <span>{incorrect} Incorrect</span>
          </div>
          {skipped > 0 && (
            <div className="quiz-results__stat-pill quiz-results__stat-pill--warning">
              <span>{skipped} Skipped</span>
            </div>
          )}
        </div>

        <button className="quiz-results__retry-btn" onClick={handleRetry}>
          <RotateCcw size={16} /> Retry Quiz
        </button>
      </div>

      {/* DETAILED REVIEW SECTION */}
      <div className="quiz-results__review-section">
        <div className="quiz-results__review-header">
          <BookOpen size={20} />
          <h3>Detailed Review</h3>
        </div>

        <div className="quiz-results__review-list">
          {quiz?.questions?.map((question, index) => {
            // find the user's answer for this question by index
            const userAnswer = userAnswers.find(a => a.questionIndex === index);
            const selectedAnswer = userAnswer?.selectedAnswer ?? null;
            const isCorrect = userAnswer?.isCorrect ?? false;
            const wasSkipped = !userAnswer;

            return (
              <div key={question._id} className="quiz-results__review-card">

                {/* Question Header */}
                <div className="quiz-results__question-header">
                  <span className="quiz-results__question-badge">
                    Question {index + 1}
                  </span>
                  <div className={`quiz-results__status-icon 
                    ${wasSkipped 
                      ? 'quiz-results__status-icon--skipped' 
                      : isCorrect 
                        ? 'quiz-results__status-icon--success' 
                        : 'quiz-results__status-icon--danger'
                    }`}
                  >
                    {wasSkipped 
                      ? <span>Skipped</span>
                      : isCorrect 
                        ? <Check size={16} strokeWidth={3} /> 
                        : <XCircle size={16} />
                    }
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="quiz-results__question-text">{question.question}</h4>

                {/* Options */}
                <div className="quiz-results__options">
                  {question.options.map((option, i) => {
                    const isCorrectOption = option === question.correctAnswer;
                    const isUserAnswer = option === selectedAnswer;
                    const isWrongUserAnswer = isUserAnswer && !isCorrect;

                    return (
                      <div
                        key={i}
                        className={`quiz-results__option 
                          ${isCorrectOption ? 'quiz-results__option--correct' : ''}
                          ${isWrongUserAnswer ? 'quiz-results__option--wrong' : ''}
                        `}
                      >
                        <span>{option}</span>
                        {isCorrectOption && (
                          <div className="quiz-results__option-badge quiz-results__option-badge--correct">
                            <CheckCircle2 size={14} />
                            <span>Correct</span>
                          </div>
                        )}
                        {isWrongUserAnswer && (
                          <div className="quiz-results__option-badge quiz-results__option-badge--wrong">
                            <XCircle size={14} />
                            <span className={`${isWrongUserAnswer && 'quiz-result__wrong-option'}`}>Your answer</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="quiz-results__explanation">
                  <div className="quiz-results__explanation-icon">
                    <BookOpen size={16} />
                  </div>
                  <div className="quiz-results__explanation-content">
                    <span className="quiz-results__explanation-label">EXPLANATION</span>
                    <p className="quiz-results__explanation-text">{question.explanation}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;