import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import crypto from 'node:crypto';
dotenv.config();
const summaryCache = new Map();

// 2. Helper to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 1. Initialize with the official library name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Setup the Model with gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite", // The ultra-fast, budget-friendly model
    systemInstruction: "You are StudyMate, a friendly and highly intelligent academic assistant. Your goal is to help students learn better by generating high-quality study materials. You always output data in the exact JSON format requested. You are encouraging, clear, and professional."
});


// 2. The retry logic wrapper
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
    let retries = 0;

    while (retries <= maxRetries) {
        try {
            // Attempt the API call
            const result = await model.generateContent(prompt);
            return result; 

        } catch (error) {
            // If we get a 429 Too Many Requests error
            if (error.status === 429) {
                if (retries === maxRetries) {
                    console.error(`Gemini API failed after ${maxRetries} retries.`);
                    throw error; 
                }

                retries++;
                // Calculate backoff time: 2s, 4s, 8s... + random jitter
                const waitTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
                
                console.warn(`[429 Rate Limit] StudyMate is pacing requests. Retrying in ${Math.round(waitTime / 1000)}s... (Attempt ${retries} of ${maxRetries})`);
                
                await delay(waitTime); 
            } else {
                // Throw any other type of error immediately
                throw error;
            }
        }
    }
}

/**
 * Generate Flashcards
 */
export const generateFlashcards = async (text, count = 10, /* difficulty */) => {
    const cleanText = text.substring(0, 15000);
    
    const prompt = `Generate exactly ${count} flashcards from the following text. 
    Return the result as a JSON array of objects. 
    Each object MUST have:
    - "question": A clear, concise question.
    - "answer": The factual answer.
    - "hint": A small clue that helps the student.
    - "difficulty": "easy", "medium", or "hard".
    
    Text: ${cleanText}`;
/* "easy", "medium", or "hard" */
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
    // 1. Create a unique, short fingerprint of the text (so we don't use massive strings as keys)
    const textHash = crypto.createHash('md5').update(text).digest('hex');

    // 2. Check if we have already summarized this exact text
    if (summaryCache.has(textHash)) {
        console.log('✅ Serving summary from cache (Saved 1 Gemini API call!)');
        return summaryCache.get(textHash);
    }

    // 3. If it's not in the cache, prepare the prompt
    const prompt = `As StudyMate, provide a concise summary of the following text with bullet points for key concepts.
    Text: ${text.substring(0, 20000)}`;

    try {
        console.log('⏳ Calling Gemini API for a fresh summary...');
        
        // Remember to pass 'model' into the helper function!
        const result = await generateContentWithRetry(model, prompt);
        const summaryText = result.response.text();

        // 4. Save the fresh summary into our cache so we never have to generate it again
        summaryCache.set(textHash, summaryText);

        return summaryText;
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