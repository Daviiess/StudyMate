/* 
router.get('/' , getAllFlashCardSets);
router.get('/:documentId', getFlashcards);
router.patch('/:setId/review/:cardId', reviewFlashcard);
router.patch('/:setId/star/:cardId', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);
*/
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch flashcard sets' };
  }
};

const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch flashcards' };
  }
};
const getFlashcardSetById = async (setId) => {
try{
  const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARD_BY_ID(setId));
  return response.data;
}catch(error){
    throw error.response?.data || { message: 'Failed to fetch flashcard set' };
}
}
const reviewFlashcard = async (setId, cardId) => {
  try {
    const response = await axiosInstance.patch(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD( setId, cardId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to review flashcard' };
  }
};

const toggleStar = async ( setId , cardId) => {
  try {
    const response = await axiosInstance.patch(API_PATHS.FLASHCARDS.TOGGLE_STAR(setId, cardId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to star flashcard' };
  }
};

const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete flashcards' };
  }
};

const flashcardService = {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStar,
  getFlashcardSetById,
  deleteFlashcardSet,
};

export default flashcardService;