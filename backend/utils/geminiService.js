import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize the Google Generative AI
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// 2. Setup the Model with the "StudyMate" Persona
// We use gemini-1.5-flash because it is optimized for structured JSON output
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are StudyMate, a friendly and highly intelligent academic assistant. Your goal is to help students learn better by generating high-quality study materials. You always output data in the exact JSON format requested. You are encouraging, clear, and professional."
});

/**
 * Generate Flashcards
 * Converts PDF text into structured StudyMate cards
 */
export const generateFlashcards = async (text, count = 10) => {
    // We limit the text to 15,000 characters to stay within context windows
    const cleanText = text.substring(0, 15000);
    
    const prompt = `Generate exactly ${count} flashcards from the following text. 
    Return the result as a JSON array of objects. 
    Each object MUST have:
    - "question": A clear, concise question.
    - "answer": The factual answer.
    - "hint": A small clue that helps the student without giving away the answer.
    - "difficulty": either "easy", "medium", or "hard".
    
    Text: ${cleanText}`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: "application/json",
                temperature: 0.7 // Balanced between creative and factual
            }
        });

        const responseText = result.response.text();
        const flashcards = JSON.parse(responseText);
        
        return Array.isArray(flashcards) ? flashcards.slice(0, count) : [];
    } catch (error) {
        console.error('StudyMate Flashcard Generation Error:', error);
        throw new Error('StudyMate failed to generate flashcards. Please try a shorter text selection.');
    }
};

/**
 * Generate Quiz
 * Creates a structured 4-option multiple choice test
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const cleanText = text.substring(0, 15000);

    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
    Return the result as a JSON array of objects.
    Each object MUST have:
    - "question": The quiz question.
    - "options": An array of exactly 4 strings.
    - "correctAnswer": The string that matches the correct option exactly.
    - "explanation": A one-sentence explanation of why that answer is correct.
    - "difficulty": "easy", "medium", or "hard".

    Text: ${cleanText}`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: "application/json",
                temperature: 0.5 // Lower temperature for more factual quiz accuracy
            }
        });

        const responseText = result.response.text();
        const quizData = JSON.parse(responseText);

        return Array.isArray(quizData) ? quizData.slice(0, numQuestions) : [];
    } catch (error) {
        console.error('StudyMate Quiz Generation Error:', error);
        throw new Error('StudyMate failed to generate the quiz.');
    }
};

/**
 * Generate Summary
 * Standard text-based response for the document overview
 */
export const generateSummary = async (text) => {
    const prompt = `As StudyMate, provide a concise summary of the following text. 
    Use bullet points for key concepts and a final "Study Tip" at the end.
    Text: ${text.substring(0, 20000)}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Summary Error:', error);
        throw new Error('StudyMate failed to summarize the document.');
    }
};
/**
 * Chat with Context (The Study Buddy)
 * This is "RAG" (Retrieval-Augmented Generation). It uses specific chunks 
 * of the PDF to answer questions accurately without hallucinating.
 */
export const chatWithContext = async (question, chunks) => {
    // We format the chunks into a clear list for the AI to "read"
    const context = chunks
        .map((c, i) => `[Reference ${i + 1}]: ${c.content}`)
        .join('\n\n');

    const prompt = `You are StudyMate. Answer the user's question using ONLY the provided context references. 
    If the answer is not found in the context, politely tell the student that the document doesn't mention it, but offer to help with other parts of the text.
    
    Context:
    ${context}
    
    Question: ${question}
    
    Answer as StudyMate:`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Chat Error:', error);
        throw new Error('StudyMate is having trouble reading that part of the document right now.');
    }
};

/**
 * Explain a Concept
 * Takes a difficult term and breaks it down using the document's specific context.
 */
export const explainConcept = async (concept, context) => {
    const cleanContext = context.substring(0, 12000);

    const prompt = `You are StudyMate. A student is struggling to understand the concept of "${concept}". 
    Explain this concept clearly and simply based on the provided context. 
    Use a "Real-World Analogy" to make it stick.
    
    Context: ${cleanContext}
    
    Explanation:`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Explanation Error:', error);
        throw new Error(`StudyMate couldn't find enough info to explain "${concept}".`);
    }
};