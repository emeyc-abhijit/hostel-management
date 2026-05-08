import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const chat = ai.chats.create({
      model: 'gemini-flash-latest',
      config: {
          systemInstruction: 'You are a helpful assistant.',
      }
    });
    const result = await chat.sendMessage({ message: 'Hello!' });
    console.log("SUCCESS:", result.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
