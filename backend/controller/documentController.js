import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import {extractTextFromPDF} from '../utils/pdfParser.js';
import {chunkText} from '../utils/textChunker.js';
/* uploadDocuments,
    getUserDocuments,
    getDocumentById,
    deleteDocument */
export const uploadDocuments = async (req, res, next) => {
try{
        if(!req.file){
        return res.status(400).json({
            success: false,
            error: "No file found",
            statusCode: 400
        });
    }
    const {title} = req.body;
    if(!title){
          //Delete uploaded file if no title provided
          await fs.unlink(req.file.path);
          return res.status(400).json({
            success: false,
            error: "Please provide a document title",
            statusCode: 400
          });  
        }
        /* const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`; */
    const document = await Document.create({
        userId: req.user._id,
        title: title,
        fileName: req.file.originalname,
        filePath: `/uploads/documents/${req.file.filename}`,
        fileSize: req.file.size,
        status: 'processing'
    });

     processPdf(document._id, req.file.path).catch(err => {
        console.error('Pdf processing error: ', err);
     });
     res.status(201).json({
        success: true,
        data: document,
        message: 'Document uploaded successfully. Processing in progress...'
     })
}catch(error){
    if(req.file){
        await fs.unlink(req.file.path).catch(() => {})
    };
    next(error);
 }
}

 //Process PDF in background (in production, use a queue like Bull)
 const processPdf = async(documentId, filePath) => {
        try{
            const {text} = await extractTextFromPDF(filePath);
            
            const chunks = chunkText(text , 500 , 500);

            //update document
            await Document.findByIdAndUpdate(documentId, {
                extractedText: text,
                chunks: chunks,
                status: 'ready'
            });
             console.log(`Document ${documentId} processed successfully`  );
        }catch(error){
            console.error(`Error processing document ${documentId}:` , error);

        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
        }
     }

     //Get user documents
     export const getUserDocuments = async(req, res, next) => {
        try{
            const documents = await Document.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(req.user._id)}
            },
            {
                $lookup: {
                 from: 'flashcards',
                 localField: '_id',
                 foreignField: 'documentId',
                 as: 'flashcardSets'   
                }
            },
            {
              $lookup: {
                from : 'quizzes',
                localField: '_id',
                foreignField: 'documentId',
                as: 'quizzes'
              }  
            },{
               $addFields: {
                flashcardCount: {$size: '$flashcardSets'},
                quizCount: {$size: '$quizzes'}
               } 
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },{
                $sort: {uploadDate: -1}
            }
        ]);
        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
            statusCode: 200
        });
        }catch(error){
            next(error)
        }
     }

     export const getDocumentById = async(req, res , next) => {
        try{
            
            const document = await Document.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statusCode: 404
            });
        }
            

            const flashcardCount = await Flashcard.countDocuments({documentId: document._id, userId: req.user._id});
            const quizCount = await Quiz.countDocuments({documentId: document._id, userId: req.user._id});

            //update last accessed
            document.lastAccessed = Date.now();
            await document.save();
            res.status(200).json({
                success: true,
                data: {
                ...document._doc,
                flashcardCount,
                quizCount
            }
            });


        }catch(error){
            next(error)
        }
     }

     export const deleteDocument = async(req , res , next) => {
    try{
        
        // 1. Find the document to make sure it exists and belongs to the user
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        const urlParts = document.filePath.split('/');
        const uniqueFilename = urlParts[urlParts.length - 1];
        
        const physicalPath = path.join(process.cwd(), 'uploads/documents', uniqueFilename);
        

        await fs.unlink(physicalPath).catch((err) => {
            console.log("Physical file already deleted or not found");
        });
        await Flashcard.deleteMany({ documentId: document._id });
        await Quiz.deleteMany({ documentId: document._id });
        await document.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: "Document and associated files deleted successfully"
        });
    }catch(error){
        next(error)
    }
}