import { RunnableSequence } from "@langchain/core/runnables";
import { IRetrieverChain } from "./interface.js";
import { Chain, Retriever } from "../types.js";

export class RetrieverChain implements IRetrieverChain {
    createChain (
        retriever: Retriever,
    ): Chain
    {
        const retrieverChain = RunnableSequence.from([
            async (input) => {
                const docs = []
                
                const textDocs = await retriever.getRelevantDocuments(input.text)
                
                for (const doc of textDocs) {
                    docs.push(doc)
                }

                const questions = input.questions.split('?')

                for (const question of questions) {
                    const questionDocs = await retriever.getRelevantDocuments(question)
                    for (const doc of questionDocs) {
                        if (docs.includes(doc)) {
                            continue
                        }
                        docs.push(doc)
                    }
                }

                return {...input, docs}
            },
            (prevReturn) => {
                return prevReturn.docs.map((doc: {
                    pageContent: string;
                }) => {
                return doc.pageContent
                }).join('\n\n')
            }
        ], "Retriever Chain")
          
        return retrieverChain;
    }
}