import React, { useEffect } from 'react';
import './QuizTakePage.scss';
import { ArrowBigLeft, ArrowBigLeftDash, ArrowLeft, ArrowRight, ArrowRightFromLine, ChevronLeft, ChevronLeftCircle, ChevronLeftIcon, ChevronRight, Donut, DonutIcon, Dot, DotIcon, DotSquare, LucideChevronLeft, MoveRight, MoveRightIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { useQuiz } from '../../../context/QuizContext';
 const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
    const {
    quiz,
    loadQuiz,
    isLoading,
    isFinished,
    activeQuestion,
    totalQuestions,
    currentIndex,
    answeredCount,
    answers,
    progress,
    handleNext,
    handlePrev,
    handleAnswer,
    handleFinish,
    isSubmitting,
    score,
    correctCount,
    userAnswers,
  } = useQuiz();
/* '/quizzes:quizId/results' */
  useEffect(() => {
    if (isFinished) {
        navigate(`/quizzes/${quizId}/results`);
    }
}, [isFinished]);

  
/*   const options = quiz?.questions?.[currentIndex].options; */
console.log('options:', quiz?.questions?.[currentIndex].options)
  useEffect(() => {
    if(quizId) loadQuiz(quizId)
  },[quizId]);
  console.log('quiz',quiz)
console.log('activeQuestion', activeQuestion)

   if (isLoading) {
    return (
      <div className='quiz-take quiz-take--centered'>
        <div className='spinner-loader-circle' />
        <p>Loading quiz...</p>
      </div>
    );
  }

   if (!quiz?.questions?.length) {
    return (
      <div className='quiz-take quiz-take--centered'>
        <p>No questions found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
    const selectedAnswer = answers[activeQuestion?._id] ?? '';
    console.log('answers: ', answers)
    const isLastQuestion = currentIndex === totalQuestions - 1;
  console.log(activeQuestion)
  return (
   <div className='quiz-take'>
    <h1>Welcome To Quiz</h1>
    <div className='quiz-take__quiz-container'>
    <div className='quiz-take__container-holder'>
     <div className='quiz-take__quiz-header'> 
      <span className='quiz-take__return-nav' onClick={() => {
        navigate(-1);
      }}>
        <ArrowBigLeft/> Back to quiz set
      </span>
      <h2> {quiz.title} </h2>
      </div>
      <div className='quiz-take__quiz-info'>
        <div className='quiz-take__quiz-info--holder'>
          <div className='quiz-take__question__remainder'>
           Question {currentIndex + 1} of {totalQuestions}
        </div>
        <div className='quiz-take__answered-questions'>
          {answeredCount} answered
        </div>
        </div>
        <div className='quiz-take__progress-bar-holder'  >
          <div className='quiz-take__progress-bar' style={{ width: `${progress}%` }} >

          </div>
        </div>
      </div>
      <div className='quiz-take__quiz-card-holder'>
      <div className='quiz-take__question-no'>
        <Dot size={25}/>
        Question {currentIndex + 1}
      </div>
      <div className='quiz-take__quiz-question'>

       {activeQuestion.question}
      </div>
        { <ul className='quiz-take__options-holder'>
          {activeQuestion?.options?.map((option, index) => {
            console.log('option', option)
            const isSelected = selectedAnswer === option;
            return(
              <li key={index} 
                  className={`quiz-take__option-item ${isSelected ? 'quiz-take__option-item--active' : ''}`}
              >
            <label className='quiz-take__option-label'>
          <input 
            type="radio" 
            value={option.text} 
            name="quiz-answer"
            checked={isSelected}
            onChange={() => handleAnswer(activeQuestion._id, option)}
            className="quiz-take__hidden-radio"
          /> 
        <span className='quiz-take__custom-radio'></span>
        <span className='quiz-take__option-text'>{option}</span>
        </label>
       </li>
            )
          })}
        </ul> }
      </div>
      <div className='quiz-take__action-holders'>
          <button className='quiz-take__prev-btn quiz-take__btn' onClick={handlePrev} disabled = {quiz?.questions.length <= 0}>
            <ChevronLeft/> Prev
          </button>
          <div className='quiz-take__question-nav'>
            {/* <span className='quiz-take__question-nav--question-box active-question'>1</span>
            <span className='quiz-take__question-nav--question-box'>2</span>
            <span className='quiz-take__question-nav--question-box'>3</span>
            <span className='quiz-take__question-nav--question-box'>4</span>
            <span className='quiz-take__question-nav--question-box'>5</span> */}
            {quiz?.questions.map((question , index) => {
              return(
                <span key={question._id}
                 className={`quiz-take__question-nav--question-box 
                    ${index === currentIndex ? 'active-question' : ''}
                    ${answers[question._id] ? 'answered-question' : ''}
                  `}
                >
                  {index + 1}
                </span>
              )
            })}
          </div>
          <button
          className='quiz-take__next-btn quiz-take__btn'
          onClick={isLastQuestion ? () => handleFinish(quizId) : handleNext}
          disabled={isLastQuestion && isSubmitting}
      >
          {isLastQuestion 
              ? isSubmitting ? 'Submitting...' : 'Finish' 
              : 'Next'
          } 
          <ChevronRight />
      </button>
      </div>
    </div>
    </div>
   </div>
  )
}

export default QuizTakePage;
