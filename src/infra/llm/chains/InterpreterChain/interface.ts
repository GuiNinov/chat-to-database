import { Chain, Models } from "../types.js";

export interface IInterpreterChain {
    // you can substitute any with a more specific type
    createChain(llm: Models["OPEN_AI"]): Chain;
}