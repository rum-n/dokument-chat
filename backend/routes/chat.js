const express = require("express");
const { requireAuth } = require("../services/auth");
const aiService = require("../services/aiService");
const { searchChunks } = require("../services/database");

const router = express.Router();

// Ask question
router.post("/ask", requireAuth, async (req, res) => {
  try {
    const { question, pdf_id } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required and must be a string",
      });
    }

    // Generate embedding for the question
    const questionEmbedding = await aiService.generateQuestionEmbedding(
      question
    );

    // Search for relevant chunks
    let relevantChunks = await searchChunks(questionEmbedding, 5);

    if (relevantChunks.length === 0) {
      // No relevant chunks found
      const questionLanguage = aiService.detectLanguage(question);

      if (
        question.toLowerCase().trim() === "здравей" ||
        question.toLowerCase().trim() === "hello" ||
        question.toLowerCase().trim() === "hi"
      ) {
        const greetingMessage =
          questionLanguage === "bg"
            ? "Здравейте! Моля, качете PDF документ и задайте въпрос за да започнем разговор."
            : "Hello! Please upload a PDF document and ask a question to start chatting.";

        return res.json({
          answer: greetingMessage,
          language: questionLanguage,
          page_references: [],
          context_chunks_used: 0,
        });
      } else {
        const noDataMessage =
          questionLanguage === "bg"
            ? "Не намерих релевантна информация в качените документи. Моля, уверете се че сте качили PDF документ."
            : "I couldn't find relevant information in the uploaded documents. Please make sure you have uploaded a PDF document.";

        return res.json({
          answer: noDataMessage,
          language: questionLanguage,
          page_references: [],
          context_chunks_used: 0,
        });
      }
    }

    // Filter chunks by PDF ID if specified
    if (pdf_id) {
      relevantChunks = relevantChunks.filter(
        (chunk) => chunk.pdf_id === pdf_id
      );

      if (relevantChunks.length === 0) {
        const questionLanguage = aiService.detectLanguage(question);
        const noDataMessage =
          questionLanguage === "bg"
            ? "Не намерих релевантна информация в този документ."
            : "I couldn't find relevant information in this document.";

        return res.json({
          answer: noDataMessage,
          language: questionLanguage,
          page_references: [],
          context_chunks_used: 0,
        });
      }
    }

    // Generate answer using AI
    const aiResponse = await aiService.generateAnswer(question, relevantChunks);

    // Convert page references to response format
    const pageRefs = aiResponse.page_references.map((ref) => ({
      page_number: ref.page_number,
      chunk_ids: ref.chunk_ids,
    }));

    res.json({
      answer: aiResponse.answer,
      language: aiResponse.language,
      page_references: pageRefs,
      context_chunks_used: aiResponse.context_chunks_used,
    });
  } catch (error) {
    console.error("Ask question error:", error);
    res.status(500).json({
      error: `Error processing question: ${error.message}`,
    });
  }
});

// Get supported languages
router.get("/languages", (req, res) => {
  res.json({
    supported_languages: [
      {
        code: "bg",
        name: "Bulgarian",
        native_name: "Български",
      },
      {
        code: "en",
        name: "English",
        native_name: "English",
      },
    ],
  });
});

module.exports = router;
