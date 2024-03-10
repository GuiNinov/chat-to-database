import { RunnableSequence } from "@langchain/core/runnables";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { ChatOpenAI } from "@langchain/openai";

export type Chain = RunnableSequence;

export type Models = {
    "OPEN_AI": ChatOpenAI,
    "GEMINI": ()=> Number
}

export type Retriever = VectorStoreRetriever