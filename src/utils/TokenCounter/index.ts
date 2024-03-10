import { ITokenCounter } from "./interface.js";
import { encoding_for_model } from "@dqbd/tiktoken";

export class TokenCounter implements ITokenCounter {
    count ( tokens: string[] ): number
    {
        const encoder = encoding_for_model("gpt-4-1106-preview");

        const t = encoder.encode(tokens.join(" "));
        encoder.free();
        return t.length;
    }
    

}