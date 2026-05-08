import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router'
import documentService from '../../../services/documentService';
import toast from 'react-hot-toast';
import { ArrowLeft, PanelLeftClose, PanelRightOpen } from 'lucide-react';
import Spinner from '../../../components/common/Spinner/Spinner';
import './DocumentDetailsPage.scss';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import Tab from '../../../components/common/Tab/Tab';
import DocumentViewer from '../../../components/DocumentViewer/DocumentViewer';

import ChatUi from '../../../components/ChatInterface/ChatUi';
import AiConcepts from '../../../components/AiConcepts/AiConcepts';
import SummaryAction from '../../../components/Summarize-action/SummaryAction';
import DeckOverviewPage from '../../FlashCards/DeckOverviewPage/DeckOverviewPage';
import { useSearchParams } from 'react-router';
import QuizzesList from '../../Quizzes/QuizList/QuizzesList';
const DocumentDetailsPage = () => {
  const {id} = useParams();
  const [document , setDocument] = useState(null);
  const [loading , setLoading] = useState(true);
  const [aiConcept, setAiConcept] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Document';
  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };
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
       {isSummaryModalOpen && <SummaryAction toggleSummary = {toggleSummary}/>}
     { aiConcept ? <AiConcepts/> : null}
      </div>
      </>
    )
  }
  const toggleSummary = () => {
    setIsSummaryModalOpen(prev => !prev)
  }
  //toggle concepts
  const toggleConceptTab = () => {
    setAiConcept(prev => !prev)
  }

  const renderChat = () => {
    return <ChatUi/>;
  }


  const renderFlashcardsTab = () => {
    return <DeckOverviewPage/>;
  }
  const renderQuizTab = () => {
    return <QuizzesList/>
  };
  
  const tabs = [
    {name: 'Document', label: 'Document', content: renderContent()},
    {name: 'Chat' , label: 'Chat' , content: renderChat()},
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
      <button className= {`${activeTab !== 'Document' ? 'hide' : 'concept-btn'}`} 
      onClick={toggleConceptTab}
      title={aiConcept ? "Close Concepts tab" : "Open Concepts tab"}
      disabled = {loading}
      > 
      {/* Concept tab */}
      {!aiConcept ? <PanelRightOpen/> : <PanelLeftClose/>}
      </button>
     
        <button className= {`${activeTab !== 'Document' ? 'hide': 'summary-btn'}`}
        onClick={toggleSummary}
        disabled = {loading}
        title='Summarize document'
        >
          Document Summary
          </button>
   
      <PageHeader title = {document.title}/>
      <Tab activeTab = {activeTab}  tabs = {tabs} handleTabChange = {handleTabChange}/>
      
    </div>
  
  )
}

export default DocumentDetailsPage
