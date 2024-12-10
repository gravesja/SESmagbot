const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// OpenAI API key should be stored in environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// API route to handle the OpenAI request
app.post('/chat', async (req, res) => {
  const userMessage = req.body.userMessage;
  const context = req.body.context;

  const prompt = `You are Fee, an accountant. Respond as Fee based on this context and user query:
  Context:
  ${context}

  User Question:
  "${userMessage}"`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are Fee, an accountant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Log the full response for debugging purposes
    console.log(response.data);

    const botResponse = response.data.choices[0]?.message?.content || 'I had trouble processing that. Can you ask another way?';
    res.json({ message: botResponse });
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error with the OpenAI API.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
