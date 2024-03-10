import { ChatOpenAI } from "@langchain/openai";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { ILlmProvider } from "./interface.js";
import { ISqlGenerationChain } from "./chains/SqlGenerationChain/interface.js";
import { IInterpreterChain } from "./chains/InterpreterChain/interface.js";
import { IAnswerValidationChain } from "./chains/AnswerValidationChain/interface.js";
import { IRetrieverChain } from "./chains/RetrieverChain/interface.js";
import { IVectorStore } from "./vector-store/interface.js";
import { ISqlValidationChain } from "./chains/SqlValidationChain/interface.js";
import { IQuestionTranslationChain } from "./chains/QuestionTranslationChain/interface.js";



export class LlmProvider implements ILlmProvider {

    openAi: ChatOpenAI;
    gpt3: ChatOpenAI;

    sqlGenerationChain: ISqlGenerationChain;
    interpreterChain: IInterpreterChain;
    answerValidationChain: IAnswerValidationChain;
    retrieverChain: IRetrieverChain;
    vectorStore: IVectorStore;
    sqlValidationChain: ISqlValidationChain;
    queryTranslationChain: IQuestionTranslationChain;

    constructor(
        chains: {
            sqlGenerationChain: ISqlGenerationChain,
            interpreterChain: IInterpreterChain,
            answerValidationChain: IAnswerValidationChain,
            retrieverChain: IRetrieverChain,
            sqlValidationChain: ISqlValidationChain,
            queryTranslationChain: IQuestionTranslationChain
        },
        vectorStores: IVectorStore,
        options:{
            openAIApiKey: string,
            verbose: boolean,
            modelName: string,
            temperature: number,
        }
    ){

        this.openAi = new ChatOpenAI({
            configuration:{
              apiKey: options.openAIApiKey,
            },
            openAIApiKey: options.openAIApiKey,
            verbose: options.verbose,
            modelName: options.modelName,
            temperature: options.temperature,
          })
        
        this.gpt3 = new ChatOpenAI({
            configuration:{
              apiKey: options.openAIApiKey,
            },
            openAIApiKey: options.openAIApiKey,
            verbose: options.verbose,
            modelName: "gpt-3.5-turbo",
            temperature: options.temperature,
          })

        this.sqlGenerationChain = chains.sqlGenerationChain;
        this.interpreterChain = chains.interpreterChain;
        this.answerValidationChain = chains.answerValidationChain;
        this.retrieverChain = chains.retrieverChain;
        this.sqlValidationChain = chains.sqlValidationChain;
        this.queryTranslationChain = chains.queryTranslationChain;

        this.vectorStore = vectorStores;
  
    }

    async handleQuestion ( question: string, sqlExecutionCallBack: (sql: string) => any ): Promise<string>
    {
        const queryTranslationChain = await this.queryTranslationChain.createChain(this.gpt3);

        const retriever = this.vectorStore.store.asRetriever();

        const retrieverChain = this.retrieverChain.createChain(retriever);

        const sqlChain = this.sqlGenerationChain.createChain(this.openAi);

        const interpreterChain = this.interpreterChain.createChain(this.openAi);
        
        const answerValidationChain = this.answerValidationChain.createChain(this.openAi);

        const sqlValidationChain = this.sqlValidationChain.createChain(this.openAi, async (sql) => await sqlExecutionCallBack(sql));

        const chains = RunnableSequence.from([
            {
                questions: queryTranslationChain,
                original_input: new RunnablePassthrough()
            },
            (prevValue => ({
                text: prevValue.original_input.text,
                questions: prevValue.questions
            })),
            {
                context: retrieverChain,
                original_input: new RunnablePassthrough()
            },
            (p => ({
                input: p.original_input.text,
                context: p.context
            })),
            {
                result: sqlChain,
                input: (previousValue) => (previousValue.input),
            },
            {
                result: sqlValidationChain,
                input: (previousValue) => (previousValue.input),
            },
            {input: interpreterChain},
            answerValidationChain
        ], "Main Chain")

        const result = await chains.invoke({
            text: question
        })

        return result;
    }

}