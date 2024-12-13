// /api/chat.js (Serverless Function for Vercel)

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel environment variables
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage, context } = req.body;

    // Log the request body for debugging
    console.log("Request received with userMessage:", userMessage);

    const prompt = `${context}\nUser: ${userMessage}\nFee:`;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", // You can change to another model if needed
        messages: [{ role: "system", content: prompt }],
      });

      const responseText = completion.data.choices[0].message.content;

      // Send the response back to the client
      res.status(200).json({ message: responseText });
    } catch (error) {
      // Log any errors that occur during the OpenAI API request
      console.error("Error during OpenAI API request:", error.message);
      res.status(500).json({ message: "Error processing request", error: error.message });
    }
  } else {
    // Handle unsupported methods (not POST)
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
