import React, { useEffect, useState } from 'react'
import { useParams,Link, NavLink } from 'react-router'
import documentService from '../../../services/documentService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Spinner from '../../../components/common/Spinner/Spinner';
import './DocumentDetailsPage.scss';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import Tab from '../../../components/common/Tab/Tab';
import DocumentViewer from '../../../components/DocumentViewer/DocumentViewer';

import ChatUi from '../../../components/ChatInterface/ChatUi';
import Ai_Actions from '../../../components/Ai-Actions/Ai_Actions';
import AiConcepts from '../../../components/AiConcepts/AiConcepts';

const DocumentDetailsPage = () => {
  const {id} = useParams();
  const [document , setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('Document');
  const [loading , setLoading] = useState(true);
  const [aiConcept, setAiConcept] = useState(false)

const fetchDocument = async() => {
  try{
    const response = await documentService.getDocumentById(id);
    console.log(response);
    setDocument(response.data);
    
  }catch(error){
    console.error('Failed to fetch documents data');
    toast.error(error.message || 'Failed to fetch document data');
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


 const renderContent = () => {
    if(loading){
      return <Spinner/>

    };
    if(!document || !document.filePath){
      return <div className='no-pdf'>PDF not available</div>
    }
    const pdfUrl = getPdfUrl();

    return(
   
      <>
      
      <div className='ai-document-grid'>
        <DocumentViewer pdfUrl = {pdfUrl} aiConcept = {aiConcept}/>
       
     { aiConcept ? <AiConcepts/> : null}
      </div>
      </>
    )
  }

  //toggle concepts
  const toggleConceptTab = () => {
    setAiConcept(prev => !prev)
  }

  const renderChat = () => {
    return <ChatUi/>;
  }

  const renderAIActions = () => {
    return <Ai_Actions/>;
  }
  const renderFlashcardsTab = () => {
    return 'flashcards';
  }
  const renderQuizTab = () => {
    return 'QuizzesTab'
  };
  
  const tabs = [
    {name: 'Document', label: 'Document', content: renderContent()},
    {name: 'Chat' , label: 'Chat' , content: renderChat()},
    {name: 'AI actions', label: 'AI Actions', content: renderAIActions()},
    {name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab()},
    {name:'Quizzes' , label: 'Quizzes' , content: renderQuizTab()}
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
      <button className= {`${activeTab !== 'Document' ? 'hide' : 'concept-btn'}`} onClick={toggleConceptTab}> 
      Concept tab
      </button>
     
        <button className= {`${activeTab !== 'Document' ? 'hide': 'summary-btn'}`} >
          Summarize button
          </button>
   
      <PageHeader title = {document.title}/>
      <Tab activeTab = {activeTab} setActiveTab = {setActiveTab} tabs = {tabs}/>
      
    </div>
  
  )
}

export default DocumentDetailsPage
