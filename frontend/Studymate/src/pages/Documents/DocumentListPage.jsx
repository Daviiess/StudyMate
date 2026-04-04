import React, { useEffect, useState } from 'react'
import {Plus, Upload, Trash2, FileText, X} from 'lucide-react';
import toast from 'react-hot-toast';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner/Spinner';

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
      console.log(data);
    }catch(error){
      console.error('error: ', error);
    }
   }

  return (
    <div>
      docList page
      <button onClick={fetchDocuments}>cook</button>
    </div>
  )
}

export default DocumentListPage
