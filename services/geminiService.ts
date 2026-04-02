
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Book } from "../types.ts";

// Utility to get a fresh AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async getBookSummary(book: Book): Promise<string> {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide an insightful, engaging 3-sentence summary of the book "${book.title}" by ${book.author}. Focus on the main themes and why it's worth reading.`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
        }
      });
      return response.text || "No summary available.";
    } catch (error) {
      console.error("Gemini Summary Error:", error);
      return "Could not generate AI summary at this time.";
    }
  },

  async askLibrarian(question: string, books: Book[]): Promise<string> {
    try {
      const ai = getAI();
      const catalog = books.map(b => `${b.title} by ${b.author} (${b.categories.join(', ')})`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful and knowledgeable digital librarian for 'Open Shelf Library'. 
        The current book catalog is:
        ${catalog}
        
        User's question: ${question}
        
        Provide a friendly, concise answer. If they ask for recommendations, suggest books from the catalog that match their interest.`,
      });
      return response.text || "I'm not sure how to answer that. Try asking about our books!";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
  },

  async generateBookDescription(title: string, author: string): Promise<{ description: string; categories: string[]; year: number; viewUrl?: string; downloadUrl?: string }> {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find real, high-quality links for the book "${title}" by ${author}. 
        Return a JSON object with: 
        - description: A professional book blurb.
        - categories: Array of 2-3 matching literary categories.
        - year: The original publication year as a number.
        - viewUrl: A REAL URL where the book can be read online (e.g. Project Gutenberg, Archive.org, or a reputable library site).
        - downloadUrl: A REAL direct download URL for the book if available (e.g. PDF/EPUB from public domain sources).
        
        Use Google Search to find the most accurate and functional links.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              categories: { type: Type.ARRAY, items: { type: Type.STRING } },
              year: { type: Type.NUMBER },
              viewUrl: { type: Type.STRING },
              downloadUrl: { type: Type.STRING }
            },
            required: ["description", "categories", "year"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Auto-fill Error:", error);
      throw error;
    }
  }
};
