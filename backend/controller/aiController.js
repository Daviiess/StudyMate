import ChatHistory from "../models/chatHistory.js";
import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from '../models/Quiz.js';

import * as geminiService from '../utils/geminiService.js';

import { findRelevantChunks } from "../utils/textChunker.js";

export const generateFlashcards = async(req, res , next) => {
    try{
        const {documentId, count = 10} = req.body;
        if(!document){
            return res.status(404).json({
                success: false,
                error: 'please provide documentId',
                statusCode: 404
            });
        }
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });
        if(!document){
            res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        };

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));
        const flashcardSet = await Flashcard.create({
             userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card =>({
               question: card.question,
               answer: card.answer,
               difficulty: card.difficulty,
               hint : card.hint,
               reviewCount: 0,
               isStarred: false 
            })) 
        })
        res.status(201).json({
            success: true,
            data: flashCardSet,
            message: 'Flashcards generated successfully'
        });
    }catch(error){
        next(error)
    }
}
export const generateQuiz = async (req, res, next) => {
    try{
         const {documentId, numQuestions = 5, title } = req.body;
           if(!documentId){
         return res.status(400).json({
            success: false,
            error: "Please provide a document",
            statusCode: 400
        });
      };
      const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
      });
     if(!document){
        return res.status(404).json({
            success: false,
            error:"Document not found or ready",
            statusCode: 404
        });
      }
      const questions = await geminiService.generateQuiz(
        document.extractedText,
        parseInt(numQuestions)
      );
      //save to database
      const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
      })
    }catch(error){

    }
}