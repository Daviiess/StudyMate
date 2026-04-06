import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashBoardPage from './pages/Dashboard/DashBoardPage';
import DocumentListPage from './pages/Documents/DocumentList/DocumentListPage';
import DocumentDetailsPage from './pages/Documents/DocumentDetails/DocumentDetailsPage';
import FlashcardsListPage from './pages/FlashCards/FlashcardsListPage';
import FlashCardPage from './pages/FlashCards/FlashCardPage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { useAuth } from './context/AuthContext';
import Spinner from './components/common/Spinner/Spinner.jsx';

const App = () => {
const {loading , isAuthenticated} = useAuth();
  if(loading){
    return (
       <Spinner/>

    )
  }
  return (
    <Router>
      <Routes>
        <Route
        path='/'
        element = {isAuthenticated ? <Navigate to={"/dashboard"} replace/> : <Navigate to={"/login"} replace/>}
        />
        <Route
          path='/login'
          element = {<LoginPage/>}
        />
        <Route path='/register' element ={<RegisterPage/>}/>

        {/* Protected Routes */}
        <Route element = {<ProtectedRoute/>}>
          <Route path='/dashboard' element = {<DashBoardPage/>}/>
          <Route path='/documents' element = {<DocumentListPage/>}/>
          <Route path='/documents/:id' element = {<DocumentDetailsPage/>}/>
          <Route path='/flashcards' element = {<FlashcardsListPage/>}/>
          <Route path='/flashcards/:id/flashcards' element = {<FlashCardPage/>}/>
          <Route path='/quizzes/:quizId' element = {<QuizTakePage/>}/>
          <Route path='/quizzes:quizId/results' element = {<QuizResultPage/>}/>
          <Route path='/profile' element = {<ProfilePage/>}/>
        </Route>
        <Route path='*' element = {<NotFoundPage/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
