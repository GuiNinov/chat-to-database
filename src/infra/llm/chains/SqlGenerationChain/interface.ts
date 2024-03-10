import { Chain, Models } from "../types.js";


export interface ISqlGenerationChain {
    // you can substitute any with a more specific type
    createChain(llm: Models["OPEN_AI"]): Chain;
}

