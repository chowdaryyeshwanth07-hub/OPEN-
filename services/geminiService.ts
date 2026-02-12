
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async getBookSummary(book: Book): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide an insightful, engaging 3-sentence summary of the book "${book.title}" by ${book.author}. Focus on the main themes and why it's worth reading.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
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

  async generateBookDescription(title: string, author: string): Promise<{ description: string; categories: string[]; year: number }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a book record for "${title}" by ${author}. 
        Return a JSON object with: 
        - description: A professional book blurb.
        - categories: Array of 2-3 matching literary categories.
        - year: The original publication year as a number.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              categories: { type: Type.ARRAY, items: { type: Type.STRING } },
              year: { type: Type.NUMBER }
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
