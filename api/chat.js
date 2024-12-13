// /api/chat.js (Serverless Function)

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel's environment variables
});

const openai = new OpenAIApi(configuration);

// Fee's background information
const feeBackgroundInfo = `Fee is 30 years old and employed as an accountant in Richmond, Virginia.
They have just moved to this employer 1 week ago and are still getting used to the new software systems.
Fee views technology as a useful tool that they control and like to ensure they have the latest version with all the new features.
Fee has never taken any computer programming or IT classes but is skilled at math and often writes and edits spreadsheet formulas for their work.
Fee enjoys the latest video games, smartphones, and hybrid cars, and they make a point of downloading and installing the newest software.
Fee is comfortable and confident with technology, enjoying learning about and using new tools.
They have high access to reliable devices and internet, often relying on their own devices rather than public or shared ones.
Fee has higher technology self-efficacy than their peers, but when tech issues arise, they often blame the technology rather than themselves.
Fee is not afraid of taking risks with new technologies, but their experience with those challenges doesn’t affect their attitude toward technology.
While they are concerned about losing personal information or identity due to new apps, they are not too worried about their location being known.
Fee tends to rely on their own devices, which lowers their perception of technology risks, but they view tech outputs as suggestions they can challenge or change.
Fee received high-quality education and is comfortable with a variety of technologies and software that use implicit assumptions, jargon, or complex structures.`;


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage } = req.body;

    // Combine Fee's background info with the user message to form a complete prompt
    const prompt = `${feeBackgroundInfo}\nUser: ${userMessage}\nFee:`;

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
