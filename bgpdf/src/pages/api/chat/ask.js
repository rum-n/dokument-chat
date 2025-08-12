import { requireAuth } from '../../../lib/services/auth';
import aiService from '../../../lib/services/aiService';
import { searchChunks } from '../../../lib/services/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await requireAuth(req, res, async () => {
      const { question, pdf_id } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required and must be a string' });
      }
      const questionEmbedding = await aiService.generateQuestionEmbedding(question);
      let relevantChunks = await searchChunks(questionEmbedding, 5);
      if (relevantChunks.length === 0) {
        const questionLanguage = aiService.detectLanguage(question);
        if (["здравей", "hello", "hi"].includes(question.toLowerCase().trim())) {
          const greetingMessage =
            questionLanguage === 'bg'
              ? 'Здравейте! Моля, качете PDF документ и задайте въпрос за да започнем разговор.'
              : 'Hello! Please upload a PDF document and ask a question to start chatting.';
          return res.json({ answer: greetingMessage, language: questionLanguage, page_references: [], context_chunks_used: 0 });
        } else {
          const noDataMessage =
            questionLanguage === 'bg'
              ? 'Не намерих релевантна информация в качените документи. Моля, уверете се че сте качили PDF документ.'
              : "I couldn't find relevant information in the uploaded documents. Please make sure you have uploaded a PDF document.";
          return res.json({ answer: noDataMessage, language: questionLanguage, page_references: [], context_chunks_used: 0 });
        }
      }
      if (pdf_id) {
        relevantChunks = relevantChunks.filter(chunk => chunk.pdf_id === pdf_id);
        if (relevantChunks.length === 0) {
          const questionLanguage = aiService.detectLanguage(question);
          const noDataMessage =
            questionLanguage === 'bg'
              ? 'Не намерих релевантна информация в този документ.'
              : "I couldn't find relevant information in this document.";
          return res.json({ answer: noDataMessage, language: questionLanguage, page_references: [], context_chunks_used: 0 });
        }
      }
      const aiResponse = await aiService.generateAnswer(question, relevantChunks);
      const pageRefs = aiResponse.page_references.map(ref => ({ page_number: ref.page_number, chunk_ids: ref.chunk_ids }));
      res.json({ answer: aiResponse.answer, language: aiResponse.language, page_references: pageRefs, context_chunks_used: aiResponse.context_chunks_used });
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ error: `Error processing question: ${error.message}` });
  }
}
