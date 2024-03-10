import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { IInterpreterChain } from "./interface.js";
import { Chain, Models } from "../types.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { humanMessage, systemMessage } from "./prompts.js";
import { RunnableSequence } from "@langchain/core/runnables";

export class InterpreterChain implements IInterpreterChain {
    createChain ( llm: Models["OPEN_AI"] ): Chain
    {
        const systemPrompt = SystemMessagePromptTemplate.fromTemplate(systemMessage);
  
        const humanPrompt = HumanMessagePromptTemplate.fromTemplate(humanMessage);
  
        const prompt = ChatPromptTemplate.fromMessages([systemPrompt, humanPrompt]);
  
        const parser = new StringOutputParser().pipe(
            (value: string) => value.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/```json/g, '').replace(/```/g, '').trim()
          )

        const chain = RunnableSequence.from([
            prompt,
            llm,
            parser
        ], "Interpreter Chain")

        return chain;
    }
}