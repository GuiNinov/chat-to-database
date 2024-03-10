import { ILlmProvider } from "src/infra/llm/interface.js";
import { INewQuestionUseCase } from "./interface.js";
import { IRepository } from "src/infra/repository/interface.js";

export class NewQuestionUseCase implements INewQuestionUseCase {
    constructor(
        private readonly llmProvider: ILlmProvider,
        private readonly repository: IRepository
    ){}

    async run ( question: string ): Promise<string> {
        
        const res = await this.llmProvider.handleQuestion(
            question,
            async (query) => {
                const rows = await this.repository.query(query);
                return JSON.stringify(rows);
            }
        );

        return res;
    }
}