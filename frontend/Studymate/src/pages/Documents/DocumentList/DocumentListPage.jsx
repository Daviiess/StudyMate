import React, { useEffect, useState } from 'react'
import {Plus, Upload, Trash2, FileText, X} from 'lucide-react';
import toast from 'react-hot-toast';
import documentService from '../../../services/documentService.js';
import Spinner from '../../../components/common/Spinner/Spinner.jsx';
import Button from '../../../components/common/Button/Button.jsx';
import './DocumentListPage.scss'
import DocumentCard from '../../../components/documents/DocumentCard.jsx';
const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading , setLoading] = useState(true);

  // state for upload modal
   const [isUpModalOpen, setIsUpModalOpen] = useState(false);
   const [uploadFile, setUploadFile] = useState(null);
   const [uploadTitle, setUploadTitle] = useState('');
   const [uploading, setUploading] = useState(false);

   //state for delete confirmation modal
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [selectedDoc, setSelectedDoc] = useState(null);

   const fetchDocuments = async () => {
    try{
      const data = await documentService.getDocuments();
      setDocuments(data.count);
     
    }catch(error){
      console.error('error: ', error);
      toast.error('Failed to fetch documents.');
    }finally{
      setLoading(false);
    }
   }
   useEffect(() => {
    fetchDocuments();
   },[]) 

 console.log('documents: ',documents);
 console.log('documents length: ',documents?.count?.length);

   //handle file change
   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
   }

   const handleUpload = async (e) => {
    e.preventDefault();
    if(!uploadFile || !uploadTitle){
      toast.error('Please provide a title and select a file');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try{
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUpModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();

    }catch(error){
      toast.error(error.message || "Upload failed")
    }finally{
      setUploading(false);
    }
   };

   const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
   }

   const handleConfirmDelete = async () => {
    if(!selectedDoc) return;
    setDeleting(true);
    try{
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    }catch(error){
      toast.error(error.message || "Failed to delete documents. ")
    }finally{
      setDeleting(false);
    }
   };
   const renderContent = () => {
    if(loading){
      return <Spinner/>
      
    };
    if(documents?.length <= 0){
      return (
        <div className='empty-documents-container'>
          <div className='empty-documents-container__icon-wrapper'>
            <FileText strokeWidth={2} size={30}/>
          </div>
          <h3>No Documents Yet</h3>
          <p>Get started by uploading your first PDF document
            to begin learning.
          </p>
          <Button onClick={() => setIsDeleteModalOpen(true) }> <Plus/> Upload Document  </Button>
        </div>
      )

    }
    return(
      <div className='document-grid'>
        {documents?.map((document) => {
          return (
            <DocumentCard
            key={document._id}
            document={document}
            onDelete={handleDeleteRequest}
            />
          )
        })}
      </div>
    )
   };

  return (
    <div className='doc-list'>
      <div className='doc-list__header'>
      <div className='doc-list__header-text-holder'>
        <h2>My Documents</h2>
        <p>Manage your learning materials</p>
      </div>
     <Button> <Plus size={18}/> Upload Document</Button>
      </div>
    <div className=''>
      {renderContent()}
    </div>
     <div className="upload-modal" onClick={() => setIsUpModalOpen(false)}>
   <div className="upload-modal__overlay" onClick={(e) => e.stopPropagation()}>
    
    {/* --- Header Section --- */}
    <div className="upload-modal__header">
      <h3 className="upload-modal__title">Upload Document</h3>
      <button 
        className="upload-modal__close-btn" 
        onClick={() => setIsUpModalOpen(false)}
        aria-label="Close modal"
      >
        <X size={20} className="upload-modal__close-icon" />
      </button>
    </div>

    {/* --- Form Section --- */}
    <form onSubmit={handleUpload} className="upload-modal__form">
      
      {/* Title Input Group */}
      <div className="upload-modal__field-group">
        <label className="upload-modal__label">Document Title</label>
        <input 
          type="text" 
          className="upload-modal__input-text"
          placeholder="e.g. Biology Notes - Week 1"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          required
        />
      </div>

      {/* File Upload Group */}
      <div className="upload-modal__field-group">
        <label className="upload-modal__label">Select File (PDF only)</label>
       <div className={`upload-modal__upload-zone ${uploadFile ? 'upload-modal__upload-zone--has-file' : ''}`}>
  <input 
    type="file" 
    id="file-upload"
    className="upload-modal__input-file"
    accept=".pdf" 
    onChange={handleFileChange}
    hidden
  />
  <label htmlFor="file-upload" className="upload-modal__drop-zone">
    {/* The icon and text will inherit the glow from the parent modifier */}
    <Upload size={24} className="upload-modal__upload-icon" />
    <span className="upload-modal__file-status">
      {uploadFile ? uploadFile.name : "Click to select a PDF"}
    </span>
  </label>
</div>
      </div>

      {/* Action Buttons */}
      <div className="upload-modal__actions">
        {/* <Button 
          type="button" 
          className="upload-modal__btn upload-modal__btn--cancel"
          variant="secondary" 
          onClick={() => setIsUpModalOpen(false)}
        >
          Cancel
        </Button> */}
        <button className='upload-modal__btn--cancel'
        type='button'
        onClick={() => setIsUpModalOpen(false)}
        >
          Cancel
        </button>
        {<Button 
          type="submit" 
          className={`upload-modal__btn upload-modal__btn--submit ${uploading ? 'upload-modal__btn--loading' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Now'}
        </Button> }
      </div>
      
    </form>
  </div>
</div>
    </div>
  )
}

export default DocumentListPage
