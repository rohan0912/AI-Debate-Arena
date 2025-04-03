// File: app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Initialize Grok client using OpenAI SDK compatibility
const grokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1"
});

// Routes
app.get('/', (req, res) => {
  res.send('AI Debate API is running');
});

// Main debate endpoint
app.post('/api/debate', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    console.log(`Starting debate on topic: ${topic}`);
    
    // Initiate the debate with all models
    const debateResults = await runDebate(topic);
    
    res.json(debateResults);
  } catch (error) {
    console.error('Error in debate:', error);
    res.status(500).json({ error: 'Failed to generate debate', details: error.message });
  }
});

// Function to run the debate between models
async function runDebate(topic) {
  const models = [
    { name: 'Grok (xAI)', handler: generateGrokResponse },
    { name: 'ChatGPT (OpenAI)', handler: generateOpenAIResponse },
    { name: 'DeepSeek', handler: generateDeepSeekResponse },
    { name: 'Claude (Anthropic)', handler: generateClaudeResponse }
  ];
  
  const responses = [];
  let currentPrompt = `Topic for debate: ${topic}`;
  
  for (const model of models) {
    console.log(`Getting response from ${model.name}...`);
    
    try {
      const response = await model.handler(currentPrompt);
      
      const modelResponse = {
        model: model.name,
        response: response
      };
      
      responses.push(modelResponse);
      
      // Update the prompt for the next model to include the previous response
      currentPrompt = `
Topic for debate: ${topic}
Previous response from ${model.name}: ${response}
Please continue the debate by responding to the points made by the previous model.`;
      
    } catch (error) {
      console.error(`Error with ${model.name}:`, error);
      responses.push({
        model: model.name,
        response: `Error: Unable to generate response from ${model.name}. ${error.message}`
      });
      
      // Continue the debate even if one model fails
      currentPrompt = `
Topic for debate: ${topic}
Please continue the debate.`;
    }
  }
  
  return {
    topic,
    responses
  };
}

// Handler functions for each AI model with concise response instructions
async function generateGrokResponse(prompt) {
  try {
    const response = await grokClient.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: "You are participating in a brief debate with other AI models. Provide a concise, well-reasoned argument on the given topic in no more than two short paragraphs. Be direct and focused on your key points." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Grok API error:', error);
    throw new Error(`Grok API error: ${error.message}`);
  }
}

async function generateOpenAIResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are participating in a brief debate with other AI models. Provide a concise, well-reasoned argument on the given topic in no more than two short paragraphs. Be direct and focused on your key points." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function generateClaudeResponse(prompt) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 200,
      system: "You are participating in a brief debate with other AI models. Provide a concise, well-reasoned argument on the given topic in no more than two short paragraphs. Be direct and focused on your key points.",
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}

async function generateDeepSeekResponse(prompt) {
  try {
    // Using OpenAI compatible endpoint instead of the direct DeepSeek endpoint
    const deepseekClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1"
    });
    
    const response = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are participating in a brief debate with other AI models. Provide a concise, well-reasoned argument on the given topic in no more than two short paragraphs. Be direct and focused on your key points." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error(`DeepSeek API error: ${error.message}`);
  }
}

// Start server
app.listen(port, () => {
  console.log(`AI Debate server running on port ${port}`);
});

module.exports = app;