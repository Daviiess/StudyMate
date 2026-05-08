import React, { useContext } from 'react'
import { useState, createContext, useReducer, useCallback } from 'react';
import aiService from '../services/aiService';
import flashcardService from '../services/flashcardService';
import toast from 'react-hot-toast';
import { Trophy } from 'lucide-react';
const initialState = {
    deck: {},
    allSets: [],
    currentIndex: 0,
    isFinished: false,
    isLoading: false,
    
};


export function studyReducer(state, action){
    switch(action.type){
        case 'LOADING':{
            return {...state, deck: {} ,isLoading: true }
        }
        case 'LOAD_SUCCESS': {
            return { 
                    ...state, 
                    deck: action.payload,
                    isLoading: false, 
                    currentIndex: 0,
                    isFinished: false
            }
        }
        case 'NEXT_CARD': {
           if (!state.deck?.cards) return state;
           if(state.currentIndex >= state.deck.cards.length - 1){
        return {...state, isFinished: true}
    }
    return{...state, currentIndex: state.currentIndex + 1};
}
        case 'PREV_CARD':{
            if(state.currentIndex <= 0){
                return state
            }
            return {...state, currentIndex: state.currentIndex - 1}
        }
         case 'UPDATE_CARD_LOCAL':{
            if (!state.deck?.cards) return state;
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
        case 'TOGGLE_STAR_LOCAL': {
            if (!state.deck?.cards) return state;
            const updatedCards = state.deck.cards.map(card =>
                card._id === action.payload.cardId
                    ? { ...card, isStarred: !card.isStarred }
                    : card
            );
            return {
                ...state,
                deck: { ...state.deck, cards: updatedCards },
            };
        }
        case 'DELETE_SET': {
            if(!state.allSets) return state;
            console.log('statedeck',state.deck);
            return{
                ...state,
                allSets: state.allSets.filter(set => set._id !== action.payload)
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
     
        const getFlashcardSet = useCallback(async (setId) => {
        dispatch({ type: 'LOADING' });
        try {
            const response = await flashcardService.getFlashcardSetById(setId);
            dispatch({ type: 'LOAD_SUCCESS', payload: response.data });
        } catch (error) {
            console.error('Failed to fetch flashcard set', error);
            toast.error('Failed to load flashcard set');
        }
    }, []);

    const handleNextCard = async (setId, cardId) => {
     
        dispatch({ type: 'NEXT_CARD'})

    }
    const handlePrevCard = () => {
        dispatch({type: 'PREV_CARD'});
    }
    const handleReview = async (setId, cardId) => {
        console.log('handleReview called with:', {  setId,cardId, });
        let predictedCount;
      let targetedCard = state.deck?.cards?.find(card => card._id === cardId);
      if (!targetedCard) return;
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
             
            await flashcardService.reviewFlashcard(setId, cardId);  
        } catch (error) {
            toast.error('Card review failed')
        }
    };
    const handleToggleStar = async (cardId, setId) => {
        dispatch({ type: 'TOGGLE_STAR_LOCAL', payload: { cardId } });
        try {
            await flashcardService.toggleStar(setId, cardId);
            const targetedCard = state.deck.cards.find(card => card._id === cardId);
            targetedCard.isStarred === false ? toast.success('card successfully starred') : toast.success('card is no longer starred');
        } catch (error) {
            toast.error('Failed to star card');
            dispatch({ type: 'TOGGLE_STAR_LOCAL', payload: { cardId } });
        }
    };
    const handleDelete = async(id) => {
        dispatch({type: 'DELETE_SET', payload: id});
        try{
            await flashcardService.deleteFlashcardSet(id);
            toast.success('Flashcard set successfully deleted');
        }catch(error){
            console.error('Failed to delete flashcard set');
            toast.error('Failed to delete flashcard set');
        }
    }
    

    const activeCard = state.deck?.cards?.[state.currentIndex] ?? null;

    const value = {
        deck: state.deck,
        activeCard,
        currentIndex: state.currentIndex,
        isFinished: state.isFinished,
        isLoading: state.isLoading,
        totalCards: state.deck?.cards?.length || 0,
        generateDeck,
        handleReview,
        handleToggleStar,
        getFlashcardSet,
        handleNextCard,
        handlePrevCard,
        handleDelete
      
    };

    return (
        <StudyContext.Provider value={value}>
            {children}
        </StudyContext.Provider>
    );
}