import React, { useEffect, useState } from 'react'
import './AiConcepts.scss'
import {motion} from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import './AiConcepts.scss';
import aiService from '../../services/aiService';
import { useParams } from 'react-router';
import { ConceptRenderer } from '../common/ConceptRenderer/ConceptRenderer';
const AiConcepts = () => {
  const [concept , setConcept] = useState('');
  const [loading , setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const {id: documentId} = useParams();
  const handlingConcept = async(e) => {
    e.preventDefault();
    if(!concept.trim()) return;
    setLoading(true)
    try{
      const response = await aiService.explainConcept(documentId, concept);
      console.log(response);
      setExplanation(response);
      
    }catch(error){
      console.error('concept error:', error);
    }finally{
      setConcept('')
      setLoading(false)
    }
  }
  return (
    <motion.div 
      className='ai-concepts'
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}      
      exit={{ x: '100%', opacity: 0 }}    
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
     <div className='ai-concepts__header'>
       <div className='ai-concepts__header--icon-holder'>
        <Lightbulb fill='#F59E0B' size={30}/> </div>
        
        <span className='ai-concepts__header--text'>Explain</span>
     </div>

      <div className='ai-concepts__text-holder'>
     <h3 className='ai-concepts__middle-text--1'>
      Stuck on a difficult concept? Let's figure it out together.
     </h3>
    <p className='ai-concepts__middle-text--2'>
    StudyMate is here to simplify the jargon and guide your study session.
    </p>
    </div>
      <div className='ai-concepts__ai-output'>
      <ConceptRenderer data = {explanation}/> 
      </div>
      <div className='ai-concepts__action-holders'>
        <form className='ai-concepts__form' onSubmit={handlingConcept}>
          <input type="text" 
        className='ai-concepts__input'
         placeholder='Ask Studymate for a concept'
         value={concept}
         onChange={(e) => setConcept(e.target.value)}
         />
        <button className='ai-concepts__explain-btn'
        disabled = {!concept || loading}
        >
          
          {
            loading ? 
            <>
            <div className='loading-spinner'/>
            Explaining
            </>
            : 'Explain concept'
          }
        </button>
        </form>
      </div>
    </motion.div>
  )
}

export default AiConcepts
