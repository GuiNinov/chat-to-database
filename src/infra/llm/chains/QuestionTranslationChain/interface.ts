import { Chain, Models } from "../types.js";

export interface IQuestionTranslationChain {
    createChain ( llm: Models["OPEN_AI"]): Promise<Chain>
}