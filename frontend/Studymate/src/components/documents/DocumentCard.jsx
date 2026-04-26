import React from 'react'
import './DocumentCard.scss';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock} from 'lucide-react';
import { useNavigate } from 'react-router';
export const truncateTitle = (title, maxLength = 20) => {
  if (title?.length <= maxLength) return title;
  return title?.substring(0, maxLength) + "...";
};
const formatFileSize = (bytes) => {
    if(bytes === undefined || bytes === null) return 'N/A';
    const units = ['B' , 'KB' , 'MB' , 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while(size >= 1024 && unitIndex < units.length - 1){
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const DocumentCard = ({document, onDelete, deleteModal}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };
 const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'yesterday';
  return `${diffInDays} days ago`;
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
