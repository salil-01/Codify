const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = 3000; // You can change this to your desired port number
const YOUR_OPENAI_API_KEY = process.env.OPENAI_API_KEY;
app.use(express.json());

// Define the route for code conversion
app.post("/convert", async (req, res) => {
  try {
    const { code, targetLanguage } = req.body;

    // Make a request to the OpenAI API to convert the code
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `Translate the following code from ${targetLanguage} to ${code}`,
        max_tokens: 200,
        temperature: 0.8,
        n: 1,
        stop: ["\n"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${YOUR_OPENAI_API_KEY}`, // Replace with your OpenAI API key
        },
      }
    );

    const convertedCode = response.data.choices[0].text;

    res.json({ convertedCode });
  } catch (error) {
    console.error("Error during code conversion:", error);
    res.status(500).json({ error: "Failed to convert the code." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
