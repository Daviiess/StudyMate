import React from 'react'
import './DocumentCard.scss';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock} from 'lucide-react';
import { useNavigate } from 'react-router';
import{
    formatTimeAgo,
    formatFileSize, 
    truncateTitle
   } from '../../utils/util';


const DocumentCard = ({document, onDelete, deleteModal}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };
 

  return (
    <div className='document-card'>
        <div onClick={handleNavigate} className='document-card__flex'>
      <div className='document-card__icon-holder'>
        <div className='document-card__icon-wrapper'>
        <FileText size={35}/>
      </div>
      </div>
      <div className='document-card__text-details'>
        <p className='document-card__title'>{truncateTitle(document.title)}</p>
        <p className='document-card__size'>{formatFileSize(document.fileSize)}</p>
      </div>
      <div className='document-card__activity-holder'>
        <span className='document-card__flashcards-holder'><BookOpen size={18}/> {document.flashcardCount} Flashcards </span>
        <span className='document-card__quizzes-holder'><BrainCircuit size={18}/> {document.quizCount} Quizzes </span>
      </div>
      <div className='document-card__footer'>
         <div className='document-card__footer-items'>
            <Clock size={15}/> <span>Uploaded {formatTimeAgo(document.uploadDate || document.createdAt)}</span> 
         </div>
      </div>
      </div>
      <button className='document-card__delete' onClick={handleDelete}>
        <Trash2 size={20} onClick={deleteModal}/>
      </button>

    </div>
  )
}

export default DocumentCard
