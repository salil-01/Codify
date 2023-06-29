const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(cors()); // Enable CORS middleware

app.post("/convert", async (req, res) => {
  try {
    const { code, targetLanguage } = req.body;
    console.log(code, targetLanguage);
    // Construct the prompt
    const prompt = `Translate the following code to ${targetLanguage}:\n\n${code}\n\n`;

    // Call OpenAI API for code conversion
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0,
    });
    console.log(response.data);
    const convertedCode = response.data.choices[0].text;
    res.json({ convertedCode });
  } catch (error) {
    console.error("Error during code conversion:", error);
    res.status(500).json({ error: "Error during code conversion" });
  }
});

app.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);

    // Construct the prompt
    const prompt = `Debug the following code:\n\n${code}\n\nHighlight and correct any errors in the code, providing line-by-line explanations:\n\n---\n`;

    // Call OpenAI API for code debugging
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0,
    });
    console.log(response.data);
    const debuggedCode = response.data.choices[0].text;
    res.json({ debuggedCode });
  } catch (error) {
    console.error("Error during code debugging:", error);
    res.status(500).json({ error: "Error during code debugging" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
