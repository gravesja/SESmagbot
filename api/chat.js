// /api/chat.js (Serverless Function)

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel's environment variables
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage, context } = req.body;

    // Combine the user message with the context
    const prompt = `${context}\nUser: ${userMessage}\nFee:`;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", // or another model you are using
        messages: [{ role: "system", content: prompt }],
      });

      // Get the response text
      const responseText = completion.data.choices[0].message.content;

      res.status(200).json({ message: responseText });
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      res.status(500).json({ message: "Error processing request" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
