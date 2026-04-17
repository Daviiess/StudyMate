import React, { useEffect, useRef, useState } from 'react'
import './ChatUi.scss';
import {useParams} from 'react-router-dom';
import aiService from '../../services/aiService';
import { Bot, GraduationCap, MessageSquare, Send, Sparkles, Wand2 } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer/MarkdownRenderer.jsx';
import {useAuth} from '../../context/AuthContext.jsx';
const ChatUi = () => {
    const {id: documentId} = useParams();
    const [chatHistory , setChatHistory] = useState([]);
    const [message , setMessage] = useState('');
    const [initialLoading , setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef()
    const {user} = useAuth();
    console.log('user: ', user);
 useEffect(() => {
    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    scrollToBottom();
 },[chatHistory])

 //fetch chat history
 useEffect(() => {
    const fetchChatHistory = async () => {
    try{
        const response = await aiService.getChatHistory(documentId);
        console.log('response: ', response)
        setChatHistory(response.data);
        
    }catch(error){     
        console.error('Chat error: ', error);
    }finally{
        setInitialLoading(false)
    }
    }
    fetchChatHistory()
 },[])

 //handle sending chat message
 const handleSendMessage = async(e) => {
    e.preventDefault(); 
    if(!message.trim) return;
   
    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('');
    setLoading(true);
    try{
        const response = await aiService.chat(documentId, message);
        console.log('chat answer: ', response)
        const aiMessage = {
            role: 'assistant',
            content: response.data.answer,
            timestamp: new Date().toISOString()
        }
        setChatHistory(prev => [...prev, aiMessage])
    }catch(error){
        console.error('error: ', error);
        const errorMessage = {
            role: 'assistant',
            content: "Sorry could not get your message.",
            timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, errorMessage])
    }finally{
        setLoading(false);
    }

 }
 

 if(initialLoading){
    return (
         <div className='loading-chat'>
          <div className='loading-chat__icon'>
            <MessageSquare size={25}/>
          </div>
          <div className='loading-chat__animation'>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
          </div>
          <p className='loading-chat__text'>Loading chat history...</p>
        </div>
    )
 }


 // formating the ai response 
  const cleanContent = (rawContent) => {
  if (!rawContent) return '';

  try {

    const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawContent;
    if (!jsonString.trim().startsWith('{')) return rawContent;
    const parsed = JSON.parse(jsonString);
    const extractedText = parsed.answer || parsed.query_response || parsed.response || Object.values(parsed)[0];

    return extractedText || rawContent; 

  } catch (error) {
    return rawContent;
  }
};

 // rendering message function
 const renderMessage = (msg, index) => {
    console.log('msg' , msg)
    const isUser = msg.role === 'user';
    const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return(
        <div key={index}
        className = {`chat__message-row ${isUser ? 'chat__message-row--user' : 'chat__message-row--ai'}`}>

            {
              !isUser && (
                <div className='chat__avatar chat__avatar--ai'>
                    <Wand2/>
                  </div>  
              )  
            }
        <div className={`chat__bubble ${isUser ? 'chat__bubble--user' : 'chat__bubble--ai'}`}>
        {!isUser ? (
          <div className="chat__markdown-container">
             <MarkdownRenderer content={cleanContent(msg.content)} />
            <p className='chat__ai-timestamp'>{formattedTime}</p>
          </div>
        ) : (
          <p className="chat__bubble-text">
           <span>{msg.content}</span> 
            <span className='chat__user-timestamp'>{formattedTime}</span>
            </p>
        )}
      </div>
        {isUser && (
        <div className="chat__avatar chat__avatar--user">
          <span>{user.username?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
      )}
        </div>
    )
 }
 
 
 console.log('chat history: ',chatHistory)
console.log('user: ', user);

  return (
    <div className='chat'>  

    <div className='chat__holder'> 
           
     {chatHistory.length === 0 ?(
        <>
         <div className='empty-chat'>
          <div className='empty-chat__icon'>
            <MessageSquare size={25}/>
          </div>

          <p className='empty-chat__main-text'>
                 Start a conversation
          </p>

          <p className='empty-chat__sub-text'>Ask StudyMate about the document.</p>
        </div>
        </>
     ) : (
        //render message
     <>
        <>
            {chatHistory.map((msg , index) => renderMessage(msg, index))}

            {
              loading && (
                <div className="chat__message-row chat__message-row--ai">
                    <div className='chat__avatar chat__avatar--ai'>
                          <Wand2 size={18} />
                    </div>
                    <div className="chat__bubble chat__bubble--ai chat__bubble--typing">
                                    <div className='loading-chat__animation' style={{ margin: 0 }}>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                    </div>
                </div>
              )
            }

            <div ref={messagesEndRef}></div>
        </>
     </> )}
     </div>
     <div className='chat__input-holder'>
           <form onSubmit={handleSendMessage} className='chat__form'>
             <input type="text" name="" id="" className='chat__input'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder='Ask a question about your study materials...'
              />
            <button className='chat__send-btn'
            disabled = {loading || !message}
            ><Send/></button>
           </form>
      </div>
    </div>
  )
}

export default ChatUi
