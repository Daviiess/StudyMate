import React, { useState , useEffect} from 'react'
import './LoginPage.scss'
import authService from '../../../services/authService.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';
import toast from 'react-hot-toast';
import {Mail, Lock, ArrowRight} from 'lucide-react';
const LoginPage = () => {
  const [email , setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
   
  useEffect(() => {
       if(error){
        const timer = setTimeout(() => {
          setError(null)
        }, 3000);
  
        return () => clearTimeout(timer)
      }
    }, [error])

  const {login} = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try{
      const response = await authService.login(email , password); 
      console.log(response.data.token)

      login(response.data.user , response.data.token); 
       toast.success('Login successful');
       navigate('/dashboard')  
      
    }catch(error){
      setError(error.message || 'Failed to login. Please check your credentials');
      toast.error(error.message || 'Failed to login.')
    }finally{
      setLoading(false);
    }
  }
  
  return (
    <div className='main-container'>
      <div className='main-container--bg'>
    <div className='login'>
      <div className='login__header'>
        <div className='logo'>   
        <img src={logo} alt="studyMate logo" className='logo__img' /> 
        </div>
          <h2 className='login__header--h1'>Welcome back</h2>
          <p className='login__header--text'>Sign in to continue your journey</p>
      </div>
      <form className='login__form'>
        <div className='login__input-holder login__input-holder--email'>
            <label className='login__label'>EMAIL</label>
             <div className='login__input-wrapper'>
            <Mail className={`${focusedField === 'email' ? 'focus' : ''}`}/>
            <input 
            type="email"
             placeholder='you@example.com'
             className='login__input'
             onFocus={() => setFocusedField('email')}
             onBlur={() => setFocusedField(null)}
             onChange={(e) => setEmail(e.target.value.trim())} 
               />
             </div>
        </div>
        <div className='login__input-holder login__input-holder--password'>
            <label className='login__label'>PASSWORD</label>
              <div className='login__input-wrapper'>
            <Lock className={`${focusedField === 'password' ? 'focus' : ''}`}/>
            <input type="password"
             placeholder='******'
             className='login__input'
             onFocus={() => setFocusedField('password')}
             onBlur={() => setFocusedField(null)}
             onChange={(e) => setPassword(e.target.value.trim())}  
              />
              </div>
        </div>

      </form>
      {/* error logs */}
            {error && (
              <div className='login__error'>
                <p className='login__error--text'>{error}</p>
              </div>
            ) }
            <button className='login__btn' onClick={handleSubmit}
            disabled = {!email.trim() || !password.trim()}
            >
              <span className='login__btn--span'>
                {loading ? (
                  <>
                  <div className='loading-spinner'/>
                  Signin in...
                  </>
                ): (
                  <>
                  Sign in
                  <ArrowRight/>
                  </>
                )}
              </span>
            </button>

            {/* Footer */}
             <div className='login__footer'>
              <p className='login__footer--text'>
                Don't have an account?{' '}
                <Link to= '/register' className='login__link'>
                  Sign up
                </Link>
              </p>
            </div>
                 </div> 
                 </div>
                {/* Subtle footer text */}
             <p className='policy-text'>
              By continuing, you agree to our Terms & Privacy Policy
            </p>
    
    </div>
  )
}

export default LoginPage
