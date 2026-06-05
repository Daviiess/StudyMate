import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FileQuestion, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../../services/quizService.js';
import aiService from '../../../services/aiService.js';

import Button from '../../../components/common/Button/Button';
import QuizCard from '../../../components/quizzes/QuizCard.jsx';
import Modal from '../../../components/common/Modal/Modal.jsx';
import './QuizzesList.scss';

const QuizzesList = () => {
  const { id: documentId } = useParams();

  // State Management
  const [quizzes, setQuizzes] = useState([]);
  const [quizCount, setQuizCount] = useState(5);
  const [quizSelected, setQuizSelected] = useState(null);

  // Distinct Loading States
  const [isFetching, setIsFetching] = useState(false); 
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // UI States
  const [isGenerating, setIsGenerating] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function fetchQuiz(silent = false) {
    if (!silent) setIsFetching(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes set');
      console.error('Failed to fetch quizzes set', error);
    } finally {
      if (!silent) setIsFetching(false);
    }
  }

  useEffect(() => {
    if (documentId) fetchQuiz(false);
  }, [documentId]);

  const generateQuiz = () => {
    setIsGenerating(false); 
    setIsGeneratingQuiz(true); // Triggers the skeleton loader in the grid

    const options = { numQuestions: quizCount };

    // Group the generation and background fetch into a single promise
    const generationPromise = async () => {
      await aiService.generateQuiz(documentId, options);
      await fetchQuiz(true); // Fetch silently so we don't trigger the full-page spinner
    };

    // toast.promise handles the execution, success, and error catching automatically.
    // (This fixes the double-generation bug!)
    toast.promise(generationPromise(), {
      loading: 'Crafting your quiz with AI... ✨',
      success: 'Quiz generated successfully! 🎉',
      error: 'Failed to generate quiz.',
    }).finally(() => {
      // Turn off the skeleton loader when everything is done
      setIsGeneratingQuiz(false);
    });
  };

  const deleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const handleDeleteRequest = (quiz) => {
    setQuizSelected(quiz);
    deleteModal();
  };

  const handleDelete = async () => {
    if (!quizSelected) return;
    setIsDeleting(true);
    
    try {
      await quizService.deleteQuiz(quizSelected._id);
      setIsDeleteModalOpen(false);
      setQuizSelected(null);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizSelected._id));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Failed to delete quiz');
      console.error('Failed to delete quiz', error);
    } finally {
      setIsDeleting(false);
    }
  };

  function EmptyQuizList() {
    return (
      <div className="empty-flashcard">
        <div className="empty-flashcard__icon-holder">
          <FileQuestion />
        </div>
        <h2>No Quizzes generated</h2>
        <p>Evaluate your mastery with a comprehensive conceptual assessment.</p>
        <div className="flashcard__option-holder">
          <Button
            disabled={isFetching || isGeneratingQuiz}
            onClick={() => setIsGenerating(true)}
          >
            {isGeneratingQuiz ? 'Generating...' : 'Generate Quiz'}
          </Button>
        </div>
      </div>
    );
  }

  function FlashcardOptionsModal() {
    return (
      <div className="options-modal-overlay">
        <div className="options-modal">
          <div className="options-modal__header">
            <h3>Generation Settings</h3>
            <button className="close-btn" onClick={() => setIsGenerating(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flashcard-options">
            <div className="flashcard-options__group">
              <label>Quiz quantity:</label>
              <input
                type="number"
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                max={15}
                min={1}
              />
            </div>
          </div>

          <div className="options-modal__footer">
            <Button onClick={generateQuiz} disabled={isGeneratingQuiz}>
              Confirm & Generate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list">
      <div className="quiz-list__header">
        <div className="quiz-list__text">
          {quizzes?.length || 0} quiz set{quizzes?.length !== 1 ? 's' : ''} available
        </div>
        <Button
          onClick={() => setIsGenerating((prev) => !prev)}
          disabled={isFetching || isGeneratingQuiz}
          className={'deck-overview__header--btn'}
        >
          {isGeneratingQuiz ? 'Generating...' : 'Generate Quiz'}{' '}
          <Sparkles size={15} color="gold" fill="#fff" />
        </Button>
      </div>

      {isFetching ? (
        <div className="quiz-list__loading">
          <div className="spinner-loader-circle" />
          <p className="spinner-text">Loading quizzes...</p>
        </div>
      ) : quizzes?.length <= 0 && !isGeneratingQuiz ? (
        <EmptyQuizList />
      ) : (
        <div className="quiz-list__grid-holder">
          {/* Render Existing Quizzes */}
          {quizzes?.map((quiz, index) => (
            <QuizCard
              quiz={quiz}
              index={quizzes.length - index}
              key={quiz._id}
              onDelete={handleDeleteRequest}
            />
          ))}

          {/* Render Dynamic Skeleton Loader while AI generates */}
          {isGeneratingQuiz && (
            <div className="skeleton-quiz-card">
              <div className="skeleton-pulse skeleton-icon"></div>
              <div className="skeleton-pulse skeleton-title"></div>
              <div className="skeleton-pulse skeleton-subtitle"></div>
              <div className="skeleton-pulse skeleton-button"></div>
            </div>
          )}
        </div>
      )}

      {isGenerating && <FlashcardOptionsModal />}
      
      {isDeleteModalOpen && (
        <Modal
          data={quizSelected}
          deleteModal={deleteModal}
          deleteDocument={handleDelete}
          deleting={isDeleting}
        />
      )}
    </div>
  );
};

export default QuizzesList;