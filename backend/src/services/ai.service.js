const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(content){
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
    // model:"gemini-3-flash",
    // Is model ko use karein, yeh 2025 ka sabse stable version hai
    // model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text;

}


async function generateVector(content) {

  

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config:{
          outputDimensionality:768
        }
    });

    return response.embeddings[0].values
}



module.exports={generateResponse,generateVector}