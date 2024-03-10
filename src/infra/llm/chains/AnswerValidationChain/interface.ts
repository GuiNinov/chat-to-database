import { Chain, Models } from "../types.js";

export interface IAnswerValidationChain {
    createChain(llm: Models["OPEN_AI"]): Chain;
}