import React, { useEffect, useState } from 'react';
import { Trophy, Target, CheckCircle2, XCircle, BookOpen, Check, RotateCcw } from 'lucide-react';
import './QuizResultPage.scss'; 
import { useQuiz } from '../../../context/QuizContext';
import { useParams, useNavigate } from "react-router-dom"; 
import quizService from '../../../services/quizService';
import toast from 'react-hot-toast';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quiz, score, correctCount, userAnswers, totalQuestions } = useQuiz();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const contextHasData = userAnswers?.length > 0 || score > 0;
    if (!contextHasData) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await quizService.getQuizResults(quizId);
          setResults(response.data);
        } catch(error) {
          toast.error('Failed to load results');
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [quizId]);

  if (loading) {
    return (
      <div className="quiz-results quiz-results--centered">
        <div className="spinner-loader-circle" />
        <p>Loading results...</p>
      </div>
    );
  }

  // derive display data from context (fresh session) or fetched results (direct nav)
  const contextHasData = userAnswers?.length > 0 || score > 0;

  const displayScore = contextHasData 
    ? score 
    : results?.quiz?.score;

  const displayTotal = contextHasData 
    ? totalQuestions 
    : results?.quiz?.totalQuestions;

  const displayTitle = contextHasData 
    ? quiz?.title 
    : results?.quiz?.title;

  const displayUserAnswers = contextHasData 
    ? userAnswers 
    : results?.results?.map(r => ({
        questionIndex: r.questionIndex,
        selectedAnswer: r.selectedAnswer,
        isCorrect: r.isCorrect
      }));

  const displayQuestions = contextHasData 
    ? quiz?.questions 
    : results?.results?.map(r => ({
        _id: r.questionIndex,
        question: r.question,
        options: r.options,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation
      }));

  const correct = displayUserAnswers?.filter(a => a.isCorrect).length ?? 0;
  const incorrect = displayUserAnswers?.filter(a => !a.isCorrect && a.selectedAnswer).length ?? 0;
  const skipped = (displayTotal ?? 0) - (displayUserAnswers?.length ?? 0);

  const getScoreMessage = () => {
    if (displayScore >= 80) return 'Excellent work!';
    if (displayScore >= 60) return 'Good effort!';
    if (displayScore >= 40) return 'Keep practicing!';
    return "Don't give up!";
  };

  const getScoreClass = () => {
    if (displayScore >= 80) return 'quiz-results__score-value--high';
    if (displayScore >= 60) return 'quiz-results__score-value--mid';
    return 'quiz-results__score-value--low';
  };

  // guard — nothing to show yet
  if (!displayQuestions?.length) {
    return (
      <div className="quiz-results quiz-results--centered">
        <p>No results found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="quiz-results">

      {/* HEADER */}
      <div className="quiz-results__header">
        <button onClick={() => navigate(-1)}>Back to sets</button>
        <h2 className="quiz-results__title">{displayTitle}</h2>
      </div>

      {/* SCORE SUMMARY CARD */}
      <div className="quiz-results__score-card">
        <div className="quiz-results__trophy-wrapper">
          <Trophy size={32} className="quiz-results__trophy-icon" />
        </div>
        <p className="quiz-results__score-label">YOUR SCORE</p>
        <h1 className={`quiz-results__score-value ${getScoreClass()}`}>
          {displayScore}%
        </h1>
        <p className="quiz-results__score-message">{getScoreMessage()}</p>

        <div className="quiz-results__stats-container">
          <div className="quiz-results__stat-pill quiz-results__stat-pill--neutral">
            <Target size={16} />
            <span>{displayTotal} Total</span>
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

       {/*  <button
          className="quiz-results__retry-btn"
          onClick={() => navigate(`/quizzes/${quizId}`)}
        >
          <RotateCcw size={16} /> Retry Quiz
        </button> */}
      </div>

      {/* DETAILED REVIEW */}
      <div className="quiz-results__review-section">
        <div className="quiz-results__review-header">
          <BookOpen size={20} />
          <h3>Detailed Review</h3>
        </div>

        <div className="quiz-results__review-list">
          {displayQuestions.map((question, index) => {
            const userAnswer = displayUserAnswers?.find(a => a.questionIndex === index);
            const selectedAnswer = userAnswer?.selectedAnswer ?? null;
            const isCorrect = userAnswer?.isCorrect ?? false;
            const wasSkipped = !userAnswer || !selectedAnswer;

            return (
              <div key={question._id ?? index} className="quiz-results__review-card">

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
                    const isWrongUserAnswer = option === selectedAnswer && !isCorrect;

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
                          <div className={`quiz-results__option-badge quiz-results__option-badge--wrong ${isWrongUserAnswer ? 'wrong-option': ''}`}>
                            <XCircle size={14} />
                            <span className={`${isWrongUserAnswer ? 'wrong-option': ''}`}>Your answer</span>
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