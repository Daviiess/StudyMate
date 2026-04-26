import React, { useContext } from 'react'
import { useState, createContext, useReducer } from 'react';
import aiService from '../services/aiService';
import flashcardService from '../services/flashcardService';
import toast from 'react-hot-toast';
const initialState = {
    deck: [],
    currentIndex: 0,
    isFinished: false,
    isLoading: false,
    isMastered: false,
    isStarred: false,
    lastReviewed: null,
    reviewCount: 0
};


export function studyReducer(state, action){
    switch(action.type){
        case 'LOADING':{
            return {...state, deck: [] ,isLoading: true }
        }
        case 'LOAD_SUCCESS': {
            return { 
                    ...state, 
                    deck: action.payload,
                    isLoading: false,
                    currentIndex: 0
            }
        }
        case 'NEXT_CARD': {
            if(state.currentIndex >= state.deck.length - 1){
                return {...state, isFinished: true}
            }
            return{...state, currentIndex: state.currentIndex + 1};
        }
        case 'PREV_CARD':{
            if(state.currentIndex < 0){
                return state
            }
            return {...state, currentIndex: state.currentIndex - 1}
        }
         case 'UPDATE_CARD_LOCAL':{
                const updatedDeck = state.deck.cards.map(card => 
                    card._id === action.payload.cardId ? {...card, 
                        ...action.payload.updates }: card
                )
                return{ ...state,
                        deck: {
                            ...state.deck,
                            cards: updatedDeck
                        },
                  }
        } 
        default:
        return state;
    } 
};


const StudyContext = createContext();

export const useStudy = () => {
    return useContext(StudyContext);
}


export const StudyProvider = ({children}) => {
    const [state, dispatch] = useReducer(studyReducer, initialState);

    const generateDeck = async (documentId, options) => {
        dispatch({type: 'LOADING'})
        try{
            const response = await aiService.generateFlashcards(documentId, options);
            dispatch({ 
            type: 'LOAD_SUCCESS', 
            payload: response.data 
        });
        }catch(error){
            console.error('Failed to generate deck: ', error);
      }
    }
    const loadDeck = async (documentId) => {
        dispatch({type: 'LOADING'});
        try{
           const response = await flashcardService.getFlashcardsForDocument(documentId)
            dispatch({
                type: 'LOAD_SUCCESS',
                payload: response.data
            })
        }catch(error){
            console.error('Failed to load deck', error);
       
        }
    }
    const getFlashcardSet = async (setId) => {
        dispatch({
            type: 'LOADING'
        });
        try{
            const response = await flashcardService.getFlashcardSetById(setId);
            dispatch({
                type: 'LOAD_SUCCESS',
                payload: response.data
            }) 
        }catch(error){
            console.error("failed to fetch flashcard set ", error);        
        }
    }
    const handleNextCard = async (setId, cardId) => {
        try{
            const response = await flashcardService.reviewFlashcard(setId, cardId);
            dispatch({
                payload: response.data
            }) 
        }catch(error){
            console.error('')
        }
        dispatch({ type: 'NEXT_CARD'})

    }
    const handlePrevCard = () => {
        dispatch({type: 'PREV_CARD'});
    }
    const handleReview = async (cardId, setId) => {
        let predictedCount;
      let targetedCard = deck.cards.find(card => card._id === cardId)
        predictedCount = targetedCard.reviewCount + 1;
            
        dispatch({ 
            type: 'UPDATE_CARD_LOCAL', 
            payload: {
                    cardId,
                    updates: {
                    reviewCount: predictedCount,
                    isMastered: predictedCount >= 3
                  } } 
        });
    
        dispatch({ type: 'NEXT_CARD' });
        try {
           const response = await flashcardService.reviewFlashcard(setId, cardId);  
        } catch (error) {
            console.error("Failed to save to database", error);
        toast.error('Card review failed')
        }
    };


    const activeCard = state.deck.length > 0 ? state.deck[state.currentIndex] : null;

    const value = {
        deck: state.deck,
        activeCard,
        currentIndex: state.currentIndex,
        isFinished: state.isFinished,
        isLoading: state.isLoading,
        sessionScore: state.sessionScore,
        totalCards: state.deck.length,
        loadDeck,
        generateDeck,
        handleReview,
        getFlashcardSet,
        handleNextCard,
        handlePrevCard
      
    };

    return (
        <StudyContext.Provider value={value}>
            {children}
        </StudyContext.Provider>
    );
}