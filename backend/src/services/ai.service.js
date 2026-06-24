const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});


async function generateResponse(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });

    return response.text;
  } catch (err) {
    console.log("Gemini Error:", err);
    return "Server busy, please try again.";
  }
}



// ========================================================
// GENERATE VECTOR
// ========================================================
// Purpose:
// Text ko embedding me convert karna
// Jo Pinecone me store hoga.

async function generateVector(content) {

  try {

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: content,

      config: {
        outputDimensionality: 768,
      },
    });

    return response.embeddings[0].values;

  } catch (err) {

    console.error("Embedding Error :", err);

    throw err;

  }
}


module.exports={generateResponse,generateVector}