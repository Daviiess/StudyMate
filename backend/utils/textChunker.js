/**
 * Common stop words to exclude from keyword matching
 * Defined outside to avoid re-creating the Set on every function call
 */
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
  'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it',
  'from', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'
]);

/**
 * Split text into chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  // 1. Critical Safety Guard: Prevent infinite loops if overlap >= chunkSize
  const effectiveOverlap = Math.min(overlap, chunkSize - 1);
  const stepSize = Math.max(1, chunkSize - effectiveOverlap);

  if (!text || text.trim().length === 0) {
    return [];
  }

  // 2. Clean text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\n /g, '\n')
    .replace(/ \n/g, '\n')
    .trim();

  // Split by paragraphs
  const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    // Handle single paragraphs larger than the chunkSize
    if (paragraphWordCount > chunkSize) {
      // Flush current chunk before processing giant paragraph
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      // Split large paragraph into word-based chunks using the safe stepSize
      for (let i = 0; i < paragraphWords.length; i += stepSize) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });

        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }

    // If adding this paragraph exceeds chunkSize, save current chunk and create overlap
    if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0
      });

      // Create overlap from previous words
      const prevWords = currentChunk.join(' ').split(/\s+/);
      const overlapWords = prevWords.slice(-Math.min(effectiveOverlap, prevWords.length));
      
      currentChunk = [...overlapWords, paragraph.trim()];
      currentWordCount = overlapWords.length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  // Add the final remaining chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex,
      pageNumber: 0
    });
  }

  return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxChunks - Maximum chunks to return
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  // Extract and clean query words once
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  // If no useful query words, return first few chunks
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id
    }));
  }

  // Pre-compile Regexes for each query word to save CPU cycles
  const wordRegexes = queryWords.map(word => ({
    word,
    exact: new RegExp(`\\b${word}\\b`, 'gi'),
    partial: new RegExp(word, 'gi')
  }));

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const wordCount = chunk.content.split(/\s+/).length || 1;
    let score = 0;
    let uniqueWordsFound = 0;

    for (const { exact, partial, word } of wordRegexes) {
      const exactMatches = (content.match(exact) || []).length;
      const partialMatches = (content.match(partial) || []).length;
      
      if (partialMatches > 0) uniqueWordsFound++;

      score += exactMatches * 3;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    // Normalize score by square root of length to avoid penalizing long chunks too much
    // Avoid division by zero with Math.sqrt(wordCount)
    const normalizedScore = score / Math.sqrt(wordCount);
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      matchedWords: uniqueWordsFound
    };
  });

  return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex)
    .slice(0, maxChunks);
};