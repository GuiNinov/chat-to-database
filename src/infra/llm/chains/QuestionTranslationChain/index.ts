import { Chain, Models } from "../types.js";
import { IQuestionTranslationChain } from "./interface.js";
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { questionsLikeMessage} from "./prompt.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class QuestionTranslationChain implements IQuestionTranslationChain {
    async createChain ( llm: Models["OPEN_AI"] ): Promise<Chain>
    {
        const nextQuestionsPrompt = HumanMessagePromptTemplate.fromTemplate(questionsLikeMessage);

        const chain = RunnableSequence.from([
            nextQuestionsPrompt,
            llm,
            new StringOutputParser(),
        ], "Question Translation Chain")

        return chain;
    }
}