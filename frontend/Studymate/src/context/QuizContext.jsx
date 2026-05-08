import React, { useContext } from 'react'
import { useState, createContext, useReducer, useCallback } from 'react';
import quizService from '../services/quizService';
import toast from 'react-hot-toast';
const initialState = {
    quiz: {},
    currentIndex: 0,
    isFinished: false,
    answered: 0,
    answers: {},
    isLoading: false,
    options:[],
    isSubmitting: false, 
    score: 0, 
    correctCount: 0,
     userAnswers: []
};

export const QuizReducer = (state, action) => {
    switch(action.type){
        case 'LOADING':{
            return {...state,quiz: {}, isLoading: true}
        }
         case 'LOAD_SUCCESS':{
            return {...state, 
                quiz: action.payload,
                isFinished: false,
                currentIndex: 0,
                isLoading: false
            }
        }
         case 'NEXT_QUESTION':{
             if (!state.quiz?.questions) return state; 
             if (state.currentIndex >= state.quiz.questions.length - 1) {
                return { ...state, isFinished: true }
            }
            return { ...state, currentIndex: state.currentIndex + 1 }
         } case 'PREV_QUESTION':{
            if (!state.quiz?.questions) return state; 
            if(state.currentIndex <= 0) return state;
            return{
                ...state,
                currentIndex: state.currentIndex - 1
            };
         }
          case 'ANSWER_QUESTION':{
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionId]: action.payload.selectedOption
                }
            }
          }
         case 'FINISH_QUIZ': {
        const score = state.quiz.questions.reduce((total, question) => {
        if (state.answers[question._id] === question.correctAnswer) {
            return total + 1;
        }
        return total;
    }, 0);

    return {
        ...state,
        score,
        isFinished: true
    };
}
case 'SUBMIT_SUCCESS': {

    return {
        ...state,
        score: action.payload.score,
        correctCount: action.payload.correctCount,
        totalQuestions: action.payload.totalQuestions,
        userAnswers: action.payload.userAnswers,
        isFinished: true,
        isSubmitting: false
    }
}
case 'SUBMITTING': {
    return { ...state, isSubmitting: true }
}
case 'SUBMIT_FAILED': {
    return { ...state, isSubmitting: false }
}
default: 
return state

    }

}

const QuizContext = createContext();
export const useQuiz = () => {
    return useContext(QuizContext);
}

export const QuizProvider = ({children}) => {
    const [state, dispatch] = useReducer(QuizReducer, initialState);

      const loadQuiz = useCallback(async (quizId) => {  // ✅ useCallback
        dispatch({ type: 'LOADING' });
        try {
            const response = await quizService.getQuizById(quizId);
            dispatch({ type: 'LOAD_SUCCESS', 
                payload: response.data });
        } catch(error) {
            console.error('Failed to load quiz: ', error);
            toast.error('Failed to load quiz');
        }
    }, []);

    const handleNext = () => {
        dispatch({type: 'NEXT_QUESTION'});
    }
    const handlePrev = () => {
        dispatch({type: 'PREV_QUESTION'});
    }
    const handleAnswer = (questionId, selectedOption) => {
        dispatch({
            type: 'ANSWER_QUESTION',
            payload: {questionId, selectedOption}
        })
    }
    const handleFinish = useCallback(async (quizId) => {
    
    const answersArray = state.quiz.questions.map((question, index) => {
        const selectedAnswer = state.answers[question._id];
       
        if (!selectedAnswer) return null;
        return {
            questionIndex: index,
            selectedAnswer
        };
    }).filter(Boolean); 

    dispatch({ type: 'SUBMITTING' });
    try {
        const response = await quizService.submitQuiz(quizId, answersArray);
        console.log('answers being sent:', answersArray);
         console.log('submit response:', response);
        dispatch({
            type: 'SUBMIT_SUCCESS',
            payload: response.data  
        });
    } catch(error) {
        console.error('Failed to submit quiz', error);
        toast.error('Failed to submit quiz');
        dispatch({ type: 'SUBMIT_FAILED' }); 
    }
}, [state.answers, state.quiz]);
    
    const activeQuestion = state?.quiz?.questions?.[state?.currentIndex] ?? null;
    const totalQuestions = state?.quiz?.questions?.length || 0;
    const answeredCount = Object.keys(state.answers).length;
    const isAnswered = activeQuestion ? state.answers[activeQuestion._id] !== undefined : false;
    const progress = totalQuestions > 0 ? ((state.currentIndex + 1) / totalQuestions) * 100 : 0;
    
    const value = {
        quiz: state.quiz,           
        answers: state.answers,     
        score: state.score,         
        isFinished: state.isFinished, 
        isLoading: state.isLoading,
        currentIndex: state.currentIndex,
        activeQuestion,
        totalQuestions,
        answeredCount,
        isAnswered,
        progress,
        isSubmitting: state.isSubmitting,
        score: state.score,
        correctCount: state.correctCount,
        userAnswers: state.userAnswers,
        handleFinish,
        loadQuiz,
        handleNext,
        handlePrev,
        /* handleReset, */
        handleAnswer,
        
    }
    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    )
}