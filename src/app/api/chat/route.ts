import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Load all documentation content
function loadAllDocs(): string {
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  const docFiles = ['getting-started.md', 'trading-guide.md', 'privacy-security.md'];
  
  let allContent = '';
  for (const file of docFiles) {
    try {
      const filePath = path.join(docsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        allContent += `\n\n# ${file.replace('.md', '').toUpperCase()}\n${content}`;
      }
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }
  
  return allContent;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Load all documentation
    const docsContent = loadAllDocs();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create the system prompt with documentation context
    const systemPrompt = `You are a helpful AI assistant for the Solana Token Launchpad documentation. 
Your role is to answer questions based ONLY on the following documentation content. 
If a question is outside the scope of this documentation, politely inform the user and guide them to relevant sections.

Be concise, friendly, and accurate. Use markdown formatting in your responses.
Include relevant examples from the documentation when helpful.

DOCUMENTATION CONTENT:
${docsContent}

Remember:
- Only answer based on the provided documentation
- Be specific and cite relevant sections when appropriate
- If unsure, acknowledge it and suggest where to look
- Keep responses concise but informative
- Use markdown formatting for better readability`;

    // Build conversation history for context
    let conversationContext = systemPrompt + '\n\n';
    
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
      });
    }

    conversationContext += `User: ${message}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = result.response;
    const text = response.text();

    return NextResponse.json(
      { 
        response: text,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to generate response', 
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
