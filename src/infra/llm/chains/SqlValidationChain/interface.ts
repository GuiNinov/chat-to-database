import { Chain, Models } from "../types.js";

export interface ISqlValidationChain {
    createChain(llm: Models["OPEN_AI"], sqlExecutionCallback: (sql: string) => any): Chain;
}