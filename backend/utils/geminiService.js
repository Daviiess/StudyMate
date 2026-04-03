import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize with the official library name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Setup the Model with gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite", // The ultra-fast, budget-friendly model
    systemInstruction: "You are StudyMate, a friendly and highly intelligent academic assistant. Your goal is to help students learn better by generating high-quality study materials. You always output data in the exact JSON format requested. You are encouraging, clear, and professional."
});

/**
 * Generate Flashcards
 */
export const generateFlashcards = async (text, count = 10) => {
    const cleanText = text.substring(0, 15000);
    
    const prompt = `Generate exactly ${count} flashcards from the following text. 
    Return the result as a JSON array of objects. 
    Each object MUST have:
    - "question": A clear, concise question.
    - "answer": The factual answer.
    - "hint": A small clue that helps the student.
    - "difficulty": "easy", "medium", or "hard".
    
    Text: ${cleanText}`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: "application/json",
                temperature: 0.7 
            }
        });

        return JSON.parse(result.response.text()).slice(0, count);
    } catch (error) {
        console.error('StudyMate Flashcard Error:', error);
        throw new Error('StudyMate failed to generate flashcards.');
    }
};

/**
 * Generate Quiz
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const cleanText = text.substring(0, 15000);

    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
    Return the result as a JSON array of objects.
    Each object MUST have:
    - "question": The quiz question.
    - "options": An array of exactly 4 strings.
    - "correctAnswer": The string matching the correct option.
    - "explanation": A one-sentence explanation.
    - "difficulty": "easy", "medium", or "hard".

    Text: ${cleanText}`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: "application/json",
                temperature: 0.5 
            }
        });

        return JSON.parse(result.response.text()).slice(0, numQuestions);
    } catch (error) {
        console.error('StudyMate Quiz Error:', error);
        throw new Error('StudyMate failed to generate the quiz.');
    }
};

/**
 * Generate Summary
 */
export const generateSummary = async (text) => {
    const prompt = `As StudyMate, provide a concise summary of the following text with bullet points for key concepts.
    Text: ${text.substring(0, 20000)}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Summary Error:', error);
        throw new Error('StudyMate failed to summarize.');
    }
};

/**
 * Chat with Context
 */
export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Ref ${i + 1}]: ${c.content}`).join('\n\n');
    const prompt = `You are StudyMate. Answer ONLY using this context: ${context}\n\nQuestion: ${question}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Chat Error:', error);
        throw new Error('StudyMate is having trouble reading that right now.');
    }
};

/**
 * Explain Concept
 */
export const explainConcept = async (concept, context) => {
    const prompt = `You are StudyMate. Explain "${concept}" simply using a real-world analogy. 
    Context: ${context.substring(0, 10000)}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('StudyMate Explanation Error:', error);
        throw new Error(`StudyMate couldn't explain "${concept}".`);
    }
};