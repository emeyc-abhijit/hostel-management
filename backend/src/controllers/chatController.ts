import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

import config from "../config/index.js";
import { getAvailableRooms, getMyProfile, getMyFees, getHostelInfo } from "../utils/chatTools.js";

const chatToolsDeclaration = {
  functionDeclarations: [
    {
      name: "getAvailableRooms",
      description: "Get the number of available rooms in the hostel system. Can optionally filter by room type and hostel name.",
      parameters: {
        type: "OBJECT",
        properties: {
          type: {
            type: "STRING",
            description: "Optional. Type of room to search for (single, double, triple)."
          },
          hostelName: {
            type: "STRING",
            description: "Optional. Name of the specific hostel to search in."
          }
        }
      }
    },
    {
      name: "getMyProfile",
      description: "Get the logged-in student's profile information, including their room allocation, roll number, and status. Requires no parameters as it uses the current session.",
      parameters: {
        type: "OBJECT",
        properties: {
           _dummy: { type: "STRING", description: "Ignore this." }
        }
      }
    },
    {
      name: "getMyFees",
      description: "Get the logged-in student's fee status, showing pending amounts and due dates. Requires no parameters as it uses the current session.",
      parameters: {
        type: "OBJECT",
        properties: {
           _dummy: { type: "STRING", description: "Ignore this." }
        }
      }
    },
    {
      name: "getHostelInfo",
      description: "Get general information about all hostels, including capacity, current occupancy, and total rooms.",
      parameters: {
        type: "OBJECT",
        properties: {
           _dummy: { type: "STRING", description: "Ignore this." }
        }
      }
    }
  ]
};

// We'll initialize it lazily when a request comes in
// so that process.env is guaranteed to be loaded
export const handleChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return sendError(res, "Message is required", undefined, 400);
    }

    let ai: GoogleGenAI | null = null;
    const apiKey = config.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        ai = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn("Failed to initialize GoogleGenAI", e);
      }
    }

    if (!ai) {
      return sendSuccess(res, "Chat response generated (mock)", {
        response: "I'm currently in demo mode! To enable real AI responses, please add your GEMINI_API_KEY to the backend .env file."
      });
    }

    // Format history for Gemini
    const systemPrompt = `You are a helpful, friendly assistant for a Hostel Management System called "Hostel Harmony". 
Your job is to answer questions about hostel rules, fees, complaints, room allocation, and general student queries.
You should be polite and concise. You have access to database tools. Use them when asked for factual data.`;

    const formattedHistory = Array.isArray(history) 
      ? history.map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }))
      : [];

    const chatConfig: any = {
      systemInstruction: systemPrompt,
      tools: [chatToolsDeclaration]
    };

    let chat;
    if (formattedHistory.length > 0) {
       chat = ai.chats.create({
           model: 'gemini-flash-latest',
           config: chatConfig,
           history: formattedHistory
       });
    } else {
       chat = ai.chats.create({
           model: 'gemini-flash-latest',
           config: chatConfig
       });
    }

    let result = await chat.sendMessage({ message });

    // Handle function calls if any
    let maxLoops = 3;
    while (result.functionCalls && result.functionCalls.length > 0 && maxLoops > 0) {
      maxLoops--;
      const functionResponses = [];
      for (const call of result.functionCalls) {
        const name = call.name;
        const args = call.args || {};
        
        // Inject userId for context-aware tools
        args.userId = req.userId;
        
        let functionResult;
        try {
          if (name === "getAvailableRooms") functionResult = await getAvailableRooms(args);
          else if (name === "getMyProfile") functionResult = await getMyProfile(args);
          else if (name === "getMyFees") functionResult = await getMyFees(args);
          else if (name === "getHostelInfo") functionResult = await getHostelInfo(args);
          else functionResult = { error: `Unknown function ${name}` };
        } catch (e: any) {
          functionResult = { error: e.message };
        }
        
        functionResponses.push({
          functionResponse: {
            name: name,
            response: functionResult
          }
        });
      }
      
      // Send the function responses back to the model
      result = await chat.sendMessage({ message: functionResponses });
    }

    let responseText = result.text || "";

    return sendSuccess(res, "Chat response generated", {
      response: responseText
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    
    // Graceful fallback for quota/billing or model errors
    let userFriendlyMessage = "Sorry, my brain is having some trouble right now.";
    if (error?.status === 429 || error?.message?.includes('exceeded')) {
      userFriendlyMessage = "Sorry, I've run out of API quota! Please check your Google Cloud billing setup.";
    } else if (error?.status === 404 || error?.status === 503) {
      userFriendlyMessage = "Sorry, the AI model is currently unavailable or experiencing high demand.";
    }

    return sendSuccess(res, "Chat response generated (fallback)", {
      response: userFriendlyMessage
    });
  }
};
