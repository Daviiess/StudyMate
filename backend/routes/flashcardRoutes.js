import express from 'express';
import {getFlashcards, getAllFlashCardSets, reviewFlashcard, 
    toggleStarFlashcard, deleteFlashcardSet,getFlashcardSetById
} from '../controller/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/' , getAllFlashCardSets);
router.get('/:documentId', getFlashcards);
router.get('/set/:setId', getFlashcardSetById);
router.patch('/:setId/review/:cardId', reviewFlashcard);
router.patch('/:setId/star/:cardId', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);

export default router;
