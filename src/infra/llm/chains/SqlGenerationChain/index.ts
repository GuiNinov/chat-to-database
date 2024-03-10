import { RunnableSequence } from "@langchain/core/runnables";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ISqlGenerationChain } from "./interface.js";
import { Chain, Models } from "../types.js";
import { humanMessage, systemMessage } from "./prompts.js";

export class SqlGenerationChain implements ISqlGenerationChain {
    createChain (llm: Models["OPEN_AI"]): Chain
    {

        const systemPrompt = SystemMessagePromptTemplate.fromTemplate(systemMessage);
  
        const userPrompt = HumanMessagePromptTemplate.fromTemplate(humanMessage);
  
        const sqlBasePrompt = ChatPromptTemplate.fromMessages([systemPrompt, userPrompt]);
        
        const formatSql = (sql: string) => {
            return sql.replace(/"/g, '').replace(/\\n/g, ' ').replace(/\\t/g, ' ').replace(/```sql/g, '').replace(/```/g, '').trim()
          }

        const sqlParser = new StringOutputParser()
        .pipe(formatSql)


        const chain = RunnableSequence.from([
            sqlBasePrompt,
            llm,
            sqlParser
        ], "SQL Generation Chain")

        return chain;
    }

}