import React, { useEffect } from 'react'
import { useParams} from 'react-router-dom';
import { useStudy } from '../../../context/StudyContext';
import './DeckOverviewPage.scss';
import { Sparkles, X } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Flashcard from '../../../components/flashcards/Flashcard';
import toast from 'react-hot-toast';
import { useState } from 'react';
import flashcardService from '../../../services/flashcardService';
const DeckOverviewPage = () => {
  const {id: documentId} = useParams();
  const {generateDeck , isLoading} = useStudy()
  const [difficulty, setDifficulty] = useState('medium')
  const [count, setCount] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deck , setDeck] = useState([]); 
  const [deckLoading, setDeckLoading] = useState(false);
  const options = {
  count,
  difficulty
}
  const fetchDeck = async() => {
    setDeckLoading(true);
    try{
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setDeck(response.data);
    }catch(error){
      console.error('failed to load deck: ', error);
      toast.error('Failed to load flashcard set');
    }finally{
      setDeckLoading(false)
    }

  }
  useEffect(() => {
    if(documentId) fetchDeck();
  }, [documentId]);

  const handleDelete = async (id) => {
    const previous = deck;
    setDeck(prev => prev.filter(set => set._id !== id)); // ✅ instant UI update
    try {
        await flashcardService.deleteFlashcardSet(id);
        toast.success('Flashcard set successfully deleted');
    } catch (error) {
        setDeck(previous); 
        toast.error('Failed to delete flashcard set');
    }
};

  
  const handleCardGeneration = async() => {
   setDeckLoading(true)
    try{
    setIsGenerating(false);
    await generateDeck(documentId, options);
    await fetchDeck();
    }catch(error){
      toast.error('Failed to create deck')
    }finally{
      setDeckLoading(false)
    }
  }


  
  const EmptyDeckIllustration = () => (
  <svg 
    width="160" 
    height="160" 
    viewBox="0 0 160 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    
    <circle cx="80" cy="80" r="60" fill="#F3E8FF" />
    <rect x="55" y="45" width="60" height="80" rx="8" transform="rotate(15 55 45)" fill="#DDD6FE" />
    <rect x="45" y="35" width="60" height="80" rx="8" transform="rotate(-5 45 35)" fill="#C4B5FD" stroke="#F3E8FF" strokeWidth="2" />
    <rect x="50" y="50" width="60" height="80" rx="8" fill="#8B5CF6" stroke="white" strokeWidth="3" shadow="sm" />
    <rect x="60" y="65" width="40" height="4" rx="2" fill="white" opacity="0.8" />
    <rect x="60" y="75" width="30" height="4" rx="2" fill="white" opacity="0.8" />
    <rect x="60" y="85" width="35" height="4" rx="2" fill="white" opacity="0.8" />
    <path d="M115 35L117 42L124 44L117 46L115 53L113 46L106 44L113 42L115 35Z" fill="#8B5CF6" />
    <path d="M35 105L36.5 110L41.5 111.5L36.5 113L35 118L33.5 113L28.5 111.5L33.5 110L35 105Z" fill="#C4B5FD" />
    <path d="M125 100L126 103L129 104L126 105L125 108L124 105L121 104L124 103L125 100Z" fill="#8B5CF6" />
  </svg>
);


  function EmptyFlashcard(){
    if(deck.length === 0){
      return(
        <>
        <div className='empty-flashcard'>
            <div className='empty-flashcard__icon-holder'>
              <EmptyDeckIllustration/>
            </div>
            <h2>No Flashcards generated</h2>
            <p>Reinforce core concepts through a curated series of active-recall study cards.</p>
           <div className='flashcard__option-holder'>
            
             <Button disabled = {deckLoading} onClick={() => setIsGenerating(true)}>
                Generate flashcards
             </Button>
           </div>
        </div>
        {isGenerating && <FlashcardOptionsModal />}
        </>
      )
    }
  }
 

  function FlashcardOptionsModal() {
    return (
      <div className="options-modal-overlay">
        <div className="options-modal">
          <div className="options-modal__header">
            <h3>Generation Settings</h3>
            <button className="close-btn" onClick={() => setIsGenerating(false)}>
               <X size={20} />
            </button>
          </div>
          
          <div className='flashcard-options'>
            <div className='flashcard-options__group'>
              <label>Select difficulty:</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className='flashcard-options__group'>
              <label>Flashcard quantity:</label>
              <input 
                type="number" 
                value={count}
                onChange={(e) => setCount(e.target.value)}
                max={15}
                min={1}
              />
            </div>
          </div>

          <div className="options-modal__footer">
            <Button onClick={handleCardGeneration} disabled={deckLoading}>
              Confirm & Generate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='deck-overview'>
      
        <>
        <div className='deck-overview__header'>
        <div className='deck-overview__header--text'>
        {deck?.length} flashcard set{deck?.length === 1 ? '' : 's'} available
      </div>
      <div className='flashcard__option-holder'>
       
        <Button className={'deck-overview__header--btn'}
        onClick={() => setIsGenerating(true)}
        >
            Generate Flashcards <Sparkles size={15} color='gold' fill='#fff'/>
        </Button>
      </div>
     </div>
      <div className='deck-overview__grid-holder'>
         {deckLoading ? (
         <div className='deck-overview__loading'>
            <div className="spinner-loader-circle"></div>
            <p className='spinner-text'>Flashcard List Loading...</p>
        </div>) : deck.length === 0 ? 
        <div className='empty-flashcard-container'>
        <EmptyFlashcard/>
          </div>
         : <>
            {Array.isArray(deck) ? (
          deck?.map((card, index) => (
            <Flashcard 
             onDelete = {handleDelete} 
              card={card} 
              key={card._id} 
              index={index} 
              documentId={documentId} 
            />
          ))
        ) : null} 
         </> 
        }
 
        
      </div>
       {isGenerating && <FlashcardOptionsModal />}
        </>
      
     
    
     
    </div>
  )
}

export default DeckOverviewPage
