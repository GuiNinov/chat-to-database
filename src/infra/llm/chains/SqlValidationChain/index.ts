import { Chain, Models } from "../types.js";
import { ISqlValidationChain } from "./interface.js";
import { RunnableSequence } from "langchain/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { systemMessage } from "./prompts.js";

export class SqlValidationChain implements ISqlValidationChain {
    createChain ( llm: Models["OPEN_AI"], sqlExecutionCallback: (sql: string) => any): Chain
    {
        const systemPrompt = SystemMessagePromptTemplate.fromTemplate(systemMessage);
  
        
        const formatSql = (sql: string) => {
            return sql.replace(/"/g, '').replace(/\\n/g, ' ').replace(/\\t/g, ' ').replace(/```sql/g, '').replace(/```/g, '').trim()
          }

        const sqlParser = new StringOutputParser()
        .pipe(formatSql)
        .pipe(sqlExecutionCallback)


        const chain = RunnableSequence.from([
            systemPrompt,
            llm,
            sqlParser
        ], "SQL Validation Chain")

        return chain;
    }
}