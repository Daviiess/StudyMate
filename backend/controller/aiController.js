import ChatHistory from "../models/ChatHistory.js";
import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from '../models/Quiz.js';

import * as geminiService from '../utils/geminiService.js';

import { findRelevantChunks } from "../utils/textChunker.js";

export const generateFlashcards = async(req, res , next) => {
    try{
        const {documentId, count = 10, difficulty = 'medium'} = req.body;
        if(!documentId){
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

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count), difficulty);
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
            data: flashcardSet,
            message: 'Flashcards generated successfully'
        });
    }catch(error){
        next(error)
    }
}
export const generateQuiz = async (req, res, next) => {
    try{
         const {documentId, numQuestions = 10, title } = req.body;
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
      res.status(201).json({
        success: true,
        data: quiz,
        message: "Quiz generated successfully"
      })
    }catch(error){
        next(error);
    }
};
export const generateSummary = async(req, res, next) =>{
    try{
        const { documentId } = req.body;
        if(!documentId){
         return res.status(400).json({
            success: false,
            error: "Document not found",
            statusCode: 400
         });   
        }
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });
        if(!document){
            return res.status(404).json({
             success: false,
             error: "Document not found or not ready",
             statusCode: 404
            })
        }
        if(!document.extractedText){
            return res.status(400).json({
                success: false,
                error: "This document does not have any readable text to summarize",
                statusCode: 400
            })
        }
        const summary = await geminiService.generateSummary(document.extractedText);
        document.summary = summary;
        await document.save();
        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: "Summary generated successfully"

        })
    }catch(error){
        next(error)
    }
}
export const chat = async(req, res, next) => {
    try{
        const {documentId, question} = req.body;
        if(!question || !documentId){
            return res.status(400).json({
                success: false,
                error: "Please provide documentId and question",
                statusCode: 400
            });
        }

            const document = await Document.findOne({
                _id: documentId,
                userId: req.user._id,
                status: 'ready'
            });
            if(!document){
                return res.status(404).json({
                    success: false, 
                    error: "Document not found or ready",
                    statusCode: 404
                });
            };
                //Find relevant chunks
            const relevantChunks = findRelevantChunks(document.chunks, question, 3);
            const chunkIndices = relevantChunks.map( c => c.chunkIndex);

            //Get or create chat history
            let chatHistory = await ChatHistory.findOne({
                userId: req.user._id,
                documentId: document._id,
            });
        if(!chatHistory){
             chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: [] 
             });
        }

        //Generate response using Gemini
        const answer = await geminiService.chatWithContext(question, relevantChunks);
        if(!answer){
            return res.status(400).json({
                success: false,
                error: "Something went wrong with the error",
                statusCode: 400
            })
        }

        //save conversation
        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date()
            },
            {
                role: "assistant",
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            }
        )
        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks: chunkIndices,
                chatHistoryId: ChatHistory._id
            },
            message: "Response generated successfully"
        });
    }catch(error){
        next(error)
    }
}
export const explainConcept = async(req, res, next) => {
    try{
        const {documentId , concept} = req.body;
        if(!documentId || !concept){
            return res.status(400).json({
                success: false,
                error: "Please provide a document and a concept",
                statusCode: 400
            })
        }
          const document = await Document.findOne({
                _id: documentId,
                userId: req.user._id,
                status: 'ready'
            })
            if(!document){
                return res.status(404).json({
                    success: false,
                    error: "Document not found or not ready",
                    statusCode: 404
                })
            }
            const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
            const context = relevantChunks.map(c => c.content).join('\n\n');

            //Generate an explanation using gemini
            const explanation = await geminiService.explainConcept(concept, context);
            res.status(200).json({
                success: true,
                data: {
                    concept, 
                    explanation,
                    relevantChunks: relevantChunks.map(c => c.chunkIndex)
                },
                message: "Explanation generated successfully"
            });
    }catch(error){
        next(error)
    }
}

export const getChatHistory = async(req, res, next) => {
    try{
        const {documentId} = req.params;
        if(!documentId){
            return res.status(400).json({
                success: false,
                error: "Please provide documentId",
                statusCode: 400
            });
        };
    const chatHistory = await ChatHistory.findOne({
        userId: req.user._id,
        documentId: documentId
    }).select("+messages");

    if(!chatHistory){
        return res.status(200).json({
            success: true,
            data: [],
            message: "No previous chat history found for this document",

        });
    };
    res.status(200).json({
        success: true,
        data: chatHistory.messages,
        message: 'Chat history retrieved successfully'
    });
    }catch(error){
        next(error);
    }
}