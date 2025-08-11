const { Mistral } = require("@mistralai/mistralai");
const { franc } = require("franc");
const config = require("../config");

const mistral = new Mistral(config.mistral.apiKey);

class AIService {
  constructor() {
    this.embeddingModel = config.mistral.embeddingModel;
    this.chatModel = config.mistral.chatModel;
  }

  async generateEmbeddings(texts) {
    try {
      // Filter out empty or whitespace-only texts
      const validTexts = texts.filter((text) => text && text.trim().length > 0);

      if (validTexts.length === 0) {
        throw new Error("No valid text content to embed");
      }

      const response = await mistral.embeddings.create({
        model: this.embeddingModel,
        inputs: validTexts,
      });

      return response.data.map((item) => item.embedding);
    } catch (error) {
      throw new Error(`Error generating embeddings: ${error.message}`);
    }
  }

  async generateAnswer(question, contextChunks) {
    try {
      // Detect question language
      const questionLanguage = this.detectLanguage(question);

      // Prepare context
      const contextText = this.prepareContext(contextChunks);

      // Create system prompt based on language
      let systemPrompt;
      if (questionLanguage === "bg") {
        systemPrompt = `Ти си помощник за въпроси и отговори на български език. 
        Отговаряй на въпросите на български, използвайки предоставения контекст от PDF документа.
        Включи кликаеми референции към страниците в отговора си във формат [Page X].`;
      } else {
        systemPrompt = `You are a helpful Q&A assistant in English. 
        Answer questions in English using the provided context from the PDF document.
        Include clickable page references in your response in the format [Page X].
        Always respond in the same language as the user's question.`;
      }

      // Create user message
      const userMessage = `Context from PDF:
${contextText}

Question: ${question}

Please provide a comprehensive answer based on the context above. Include page references in the format [Page X] where X is the page number.`;

      // Generate response
      const response = await mistral.chat.complete({
        model: this.chatModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        maxTokens: 1000,
        temperature: 0.7,
      });

      const answer = response.choices[0].message.content;

      // Extract page references
      const pageReferences = this.extractPageReferences(answer, contextChunks);

      return {
        answer: answer,
        language: questionLanguage,
        page_references: pageReferences,
        context_chunks_used: contextChunks.length,
      };
    } catch (error) {
      throw new Error(`Error generating answer: ${error.message}`);
    }
  }

  detectLanguage(text) {
    try {
      // Clean text for better detection - be less aggressive
      const cleanText = text.replace(/[^\w\sа-яё]/gi, "").toLowerCase();

      if (cleanText.length < 3) {
        // console.log(
        //   `  🔍 Text too short (${cleanText.length} chars), defaulting to English`
        // );
        return "en"; // Default to English for very short text
      }

      const detected = franc(cleanText);

      // Debug: Log the detected language (remove in production)
      // console.log(`🔍 Language detection: "${text.substring(0, 50)}..." -> ${detected}`);

      // Map language codes to our supported languages
      const languageMap = {
        bul: "bg", // Bulgarian
        mkd: "bg", // Macedonian (very similar to Bulgarian)
        eng: "en", // English
        en: "en", // English (alternative)
        bg: "bg", // Bulgarian (alternative)
      };

      const mappedLanguage = languageMap[detected];

      if (mappedLanguage) {
        return mappedLanguage;
      } else if (detected === "und") {
        // If franc can't detect the language, use our Bulgarian detection logic
        // If we don't recognize the language, try to detect English vs Bulgarian
        // by looking for common Bulgarian characters
        const bulgarianChars = /[а-яё]/i;
        const hasBulgarianChars = bulgarianChars.test(text);

        // Also check for common Bulgarian words
        const bulgarianWords =
          /\b(какво|каква|какъв|къде|кога|защо|как|кой|коя|кои|това|тези|този|тази|този|мога|може|има|няма|е|са|ще|беше|бил|била|било|били|здравейте|означава)\b/i;
        const hasBulgarianWords = bulgarianWords.test(text);

        // console.log(
        //   `  🔍 Bulgarian chars: ${hasBulgarianChars}, Bulgarian words: ${hasBulgarianWords}`
        // );

        if (hasBulgarianChars || hasBulgarianWords) {
          return "bg";
        } else {
          return "en";
        }
      } else {
        // For any other detected language, default to English
        return "en";
      }
    } catch (error) {
      console.error("Language detection error:", error);
      return "en"; // Default to English if detection fails
    }
  }

  prepareContext(chunks) {
    const contextParts = [];

    for (const chunk of chunks) {
      const pageNum = chunk.page_number;
      const text = chunk.text;
      contextParts.push(`[Page ${pageNum}]: ${text}`);
    }

    return contextParts.join("\n\n");
  }

  extractPageReferences(answer, contextChunks) {
    const pageRefs = [];

    // Find all page references in the answer
    const pagePattern = /\[Page (\d+)\]/g;
    const matches = [...answer.matchAll(pagePattern)];

    // Get unique page numbers
    const uniquePages = [
      ...new Set(matches.map((match) => parseInt(match[1]))),
    ];

    // Create reference objects
    for (const pageNum of uniquePages) {
      // Find chunks for this page
      const pageChunks = contextChunks.filter(
        (chunk) => chunk.page_number === pageNum
      );

      if (pageChunks.length > 0) {
        pageRefs.push({
          page_number: pageNum,
          chunk_ids: pageChunks.map((chunk) => chunk.chunk_id),
        });
      }
    }

    return pageRefs;
  }

  async generateQuestionEmbedding(question) {
    const embeddings = await this.generateEmbeddings([question]);
    return embeddings[0];
  }
}

module.exports = new AIService();
