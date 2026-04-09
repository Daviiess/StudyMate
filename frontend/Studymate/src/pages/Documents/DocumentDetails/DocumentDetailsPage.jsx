import React, { useEffect, useState } from 'react'
import { useParams,Link, NavLink } from 'react-router'
import documentService from '../../../services/documentService';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Spinner from '../../../components/common/Spinner/Spinner';
import './DocumentDetailsPage.scss';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import Tab from '../../../components/common/Tab/Tab';

const DocumentDetailsPage = () => {
  const {id} = useParams();
  const [document , setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('Content');
  const [loading , setLoading] = useState(true);

const fetchDocument = async() => {
  try{
    const response = await documentService.getDocumentById(id);
    console.log(response);
    setDocument(response.data);
    
  }catch(error){
    console.error('Failed to fetch documents data');
    toast.error(err.message || 'Failed to fetch document data');
  }finally{
    setLoading(false)
  }
}
  useEffect(() => {
  fetchDocument()
  }, [id])

  //Helper function to get the pdf url
 const getPdfUrl =  () => {
if(!document?.filePath) return null;

const filePath = document?.filePath;
if(filePath.startsWith('http://') || filePath.startsWith('https://')){
  return filePath;
}
const baseUrl = "http://localhost:8000";
return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`
} 
 const pdfUrl = getPdfUrl();
console.log(pdfUrl); 

  const renderChat = () => {
    return 'renderChat';
  }

  const renderAIActions = () => {
    return 'Ai-actions';
  }
  const renderFlashcardsTab = () => {
    return 'flashcards';
  }
  const renderQuizTab = () => {
    return 'QuizzesTab'
  };
  const renderContent = () => {
    return 'content';
  }
  const tabs = [
    {name: 'Content', label: 'Content', content: renderContent()},
    {name: 'Chat' , label: 'Chat' , content: renderChat()},
    {name: 'AI actions', label: 'AI Actions', content: renderChat()},
    {name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab()},
    {name:'Quizzes' , label: 'Quizzes' , content: renderQuizTab}
  ];

  if(loading){
    return <Spinner/>
  };

  if(!document){
    return <div className=''>
      Document not found.
    </div>
  };

  return (
    <div className='doc-details'>
      <div className='doc-details__link-holder'>
          <Link to={'/documents'} className='doc-details__link'>
            <ArrowLeft size={20}/> Back to documents
          </Link>
      </div>
      <PageHeader title = {document.title}/>
      <Tab activeTab = {activeTab} setActiveTab = {setActiveTab} tabs = {tabs}/>
    </div>
  
  )
}

export default DocumentDetailsPage
