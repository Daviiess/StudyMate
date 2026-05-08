import React from 'react'
import { useState, useEffect } from 'react';
import quizService from '../../../services/quizService.js';
import { useParams } from 'react-router';
import Button from '../../../components/common/Button/Button';
import { FileQuestion, Plus,X } from 'lucide-react';
import './QuizzesList.scss';
import QuizCard from '../../../components/quizzes/QuizCard.jsx';
import aiService from '../../../services/aiService.js';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal/Modal.jsx';

const QuizzesList = () => {
const [quizzes , setQuizzes] = useState([]);
const [loading, setLoading] = useState(false);
const [quizCount, setQuizCount] = useState(5);
const {id: documentId} = useParams();
const [isGenerating , setIsGenerating] = useState(false);
const [isDeleting , setIsDeleting] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
const [quizSelected, setQuizSelected] = useState(null);

const options = {
    quizCount
}
async function fetchQuiz (){
setLoading(true);
try{
const response = await quizService.getQuizzesForDocument(documentId);
setQuizzes(response.data);
console.log('quizzes',response.data, )
}catch(error){
toast.error('Failed to fetch quizzes set');
console.error('Failed to fetch quizzes set', error);
}finally{
    setLoading(false)
}

}
useEffect(() => {
if(documentId) fetchQuiz();
}, [documentId]);




const generateQuiz = async() => {
    setLoading(true)
        try{
        setIsGenerating(false);
        await aiService.generateQuiz(documentId,options);
        await fetchQuiz();
        toast.success('Quiz generated successfully');
        }catch(error){
            console.error('Failed to generate quiz: ', error)
            toast.error('Failed to generate Quiz');
        }finally{
            setLoading(false)
        }
}
   

 function EmptyQuizList(){
    if(quizzes?.length === 0 || !quizzes){
      return(
        <>
        {/* DeckOverview.scss for the styling */}
        <div className='empty-flashcard'>
            <div className='empty-flashcard__icon-holder'>
              <FileQuestion/>
            </div>
            <h2>No Quizzes generated</h2>
            <p>Evaluate your mastery with a comprehensive conceptual assessment.</p>
           <div className='flashcard__option-holder'>
            
             <Button disabled = {loading}  onClick={() => setIsGenerating(true)} >
                Generate Quiz
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
              <label>Quiz quantity:</label>
              <input 
                type="number" 
                value={quizCount}
                onChange={(e) => setQuizCount(e.target.value)}
                max={15}
                min={1}
              />
            </div>
          </div>

          <div className="options-modal__footer">
            <Button onClick={generateQuiz} disabled={loading}>
              Confirm & Generate
            </Button>
          </div>
        </div>
        
      </div>
    );
  }
  console.log('selected: ', quizSelected);
  const deleteModal = () => {
    setIsDeleteModalOpen(prev => !prev);

  }
  const handleDeleteRequest = (quiz) => {
    setQuizSelected(quiz);
    deleteModal();
  }
  const handleDelete = async() => {
    setIsDeleting(true)
    if(!quizSelected) return;
  try{
    console.log(quizSelected._id);
    await quizService.deleteQuiz(quizSelected._id);
    setIsDeleteModalOpen(false)
    setQuizSelected(null);
    setQuizzes(quizzes.filter(quiz => quiz._id !== quizSelected._id));
  }catch(error){
    toast.error('Failed to delete quiz ')
    console.error('Failed to delete quiz', error);
  }
  setIsDeleting(false);
}
  return (
    <div className='quiz-list'>
        <div className='quiz-list__header'>
            <div className='quiz-list__text'>
               {quizzes?.length} quiz set{quizzes.length > 1 ? 's' : '' } available
            </div>
            <Button onClick={() => {
                setIsGenerating(prev => !prev)
            }} disabled = {loading}>
                <Plus/> Generate Quiz
            </Button>
        </div>
       {loading ? 
       <div className='quiz-list__loading'>
       <div className='spinner-loader-circle'/>
        <p className='spinner-text'>quiz loading...</p>
       </div>: quizzes?.length <= 0 || !quizzes ?
        <>
       <EmptyQuizList/>
       </> :  
       <div className='quiz-list__grid-holder'>
        {quizzes?.map((quiz, index) => {
         /*  setQuizSelected(quiz) */
            return(
                <QuizCard quiz = {quiz} 
                index={quizzes?.length - index} 
                key={quiz._id} onDelete = {handleDeleteRequest}/>
            )
        })}
        
        </div>}
        {isGenerating && <FlashcardOptionsModal/>}
        {isDeleteModalOpen && 
        <>
        {/* data, deleteModal, deleteDocument,deleting */}
        <Modal data={quizSelected} deleteModal={deleteModal} deleteDocument={handleDelete} deleting={isDeleting}/>
        </>
        }
    </div>
  )
}

export default QuizzesList
