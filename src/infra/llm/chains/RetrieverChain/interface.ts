import { Chain } from "../types.js";

export interface IRetrieverChain {
    createChain(
        retriever: any,
    ): Chain
}