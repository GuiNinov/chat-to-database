import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { IAnswerValidationChain } from "./interface.js";
import { Chain } from "../types.js";
import { promptMessage } from "./prompt.js";
import { JsonOutputParser } from "@langchain/core/output_parsers";


export class AnswerValidationChain implements IAnswerValidationChain {
    createChain ( llm: ChatOpenAI<ChatOpenAICallOptions> ): Chain
    {
        const prompt = HumanMessagePromptTemplate.fromTemplate(promptMessage) 

        const parser = new JsonOutputParser();

        const chain = RunnableSequence.from([
            prompt,
            llm,
            parser
        ], "Answer Validation Chain")

        return chain;
    }
}