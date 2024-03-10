// const { OpenAIEmbeddings } = require("@langchain/openai");
// const { MemoryVectorStore } = require("langchain/vectorstores/memory");
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { IVectorStore } from "./interface.js";
import { ITokenCounter } from "src/utils/TokenCounter/interface.js";

export class VectorStore implements IVectorStore {
    private openAIApiKey: string;
    store?: MemoryVectorStore;

    constructor(
        openAIApiKey: string,
        private readonly tokenCounter: ITokenCounter
    ) {
        this.openAIApiKey = openAIApiKey;
    }

    async setup(dataset: string): Promise<void> {

        console.log('Splitting dataset into chunks');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 50,
            separators: ['##########', "TABLE"],
        })

        console.log('Creating documents from dataset');
        const chunks = await splitter.createDocuments([dataset])

        console.log('Creating vector store');

        let totalAmountOfTokens = 0;
        chunks.forEach((chunk) => {
            const amountOfTokens = this.tokenCounter.count([chunk.pageContent])
            totalAmountOfTokens += Number(amountOfTokens);
            if(Number(amountOfTokens) > 9000) {
                throw new Error('Dataset too large');
            }
        })

        console.log('Amount of tokens in dataset: ', totalAmountOfTokens);

        const vectorStore = await MemoryVectorStore.fromDocuments(
            chunks,
            new OpenAIEmbeddings({
                openAIApiKey: this.openAIApiKey,
            })
        )

        this.store = vectorStore;
        // const vectorStoreRetriever = vectorStore.asRetriever()

        // this.retriever = vectorStoreRetriever

        await this.test()
    }

    async test() {
        console.log('Testing vector store');
        if(!this.store) {
            throw new Error('Vector store not initialized');
        }

        const retriever = this.store.asRetriever()

        const docs = await retriever.getRelevantDocuments("Quantas análises de pessoa física foram feitas em janeiro de 2024?")

        console.log(docs.map((doc) => doc.pageContent))

    }
}