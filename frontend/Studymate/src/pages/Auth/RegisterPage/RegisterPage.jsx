import React, { useEffect, useState } from 'react'
import './RegisterPage.scss'
import authService from '../../../services/authService.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [studyGoal , setStudyGoal] = useState(''); 
  const { login } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
     if(error){
      const timer = setTimeout(() => {
        setError(null)
      }, 3000);

      return () => clearTimeout(timer)
    }
  }, [error])
   
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(username, email, password, studyGoal);  
      login( response.data.user, response.data.token);
      toast.success('Account created successfully!\n Please login to continue');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    
    } finally {
      setLoading(false);
      
    }
  }
  
  return (
    <div className='main-container'>
      <div className='main-container--bg'>
        <div className='register'>
          <div className='register__header'>
            <div className='logo'>   
              <img src={logo} alt="studyMate logo" className='logo__img' /> 
            </div>
            <h2 className='register__header--h1'>Create an account</h2>
            <p className='register__header--text'>Join StudyMate to start your journey</p>
          </div>

          <form className='register__form' onSubmit={handleSubmit}>
            
            {/* NEW: USERNAME FIELD (Fixed the 'ghost' state issue) */}
            <div className='register__input-holder register__input-holder--username'>
              <label className='register__label'>USERNAME</label>
              <div className='register__input-wrapper'>
                <User className={`${focusedField === 'username' ? 'focus' : ''}`}/>
                <input 
                  type="text"
                  placeholder='Your name'
                  className='register__input'
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div className='register__input-holder register__input-holder--email'>
              <label className='register__label'>EMAIL</label>
              <div className='register__input-wrapper'>
                <Mail className={`${focusedField === 'email' ? 'focus' : ''}`}/>
                <input 
                  type="email"
                  placeholder='you@example.com'
                  className='register__input'
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value.trim())} 
                  required
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className='register__input-holder register__input-holder--password'>
              <label className='register__label'>PASSWORD</label>
              <div className='register__input-wrapper'>
                <Lock className={`${focusedField === 'password' ? 'focus' : ''}`}/>
                <input 
                  type="password"
                  placeholder='******'
                  className='register__input'
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value.trim())}  
                  required
                />
              </div>
            </div>
            {/* 'Secondary School' , 'University' , 'Professional Certification' , 'Personal use' */}
               {!error ? <div className='register__dropdown'>
                    <select value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} className='register__select'>
                      <option value="">Select your study goal</option>
                      <option value="Secondary School">Secondary School</option>
                      <option value="University">University</option>
                      <option value="Professional Certification">Professional Certification</option>
                      <option value="Personal use">Personal use</option>
                    </select>
                </div> : null}
            {error && (
              <div className='register__error'>
                <p className='register__error--text'>{error}</p>
              </div>
            )}

            <button type="submit" className='register__btn' 
            disabled={loading || !email || !password}
            >
              <span className='register__btn--span'>
                {loading ? (
                  <>
                    <div className='loading-spinner'/>
                    Creating...
                  </>
                ) : (
                  <>
                    Create an account
                    <ArrowRight/>
                  </>
                )}
              </span>
            </button>

            <div className='register__footer'>
              <p className='register__footer--text'>
                Already have an account?{' '}
                <Link to='/login' className='register__link'>
                  Sign in
                </Link>
              </p>
            </div>
          </form> 
        </div>
          </div>
        <p className='policy-text'>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      
    </div>
  )
}

export default RegisterPage;