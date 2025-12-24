// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY});

const gptIndex=pc.Index('gpt');

// function jo memory create krega mtlb index me vectors store krenge with meta data (extra info)

async function createMemory({vectors,metadata,messageId}){

    await gptIndex.upsert([{
        id:messageId,
        values:vectors,
        metadata
    }])
}

async function queryMemory({queryVector,limit=5,metadata}){

    const data= await gptIndex.query({
        vector:queryVector,
        topK:limit,
        filter:metadata?metadata:undefined,
        includeMetadata:true
    })

    return data.matches
}

module.exports={
    createMemory,queryMemory
}

