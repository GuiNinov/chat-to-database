import { IVectorStore } from "src/infra/llm/vector-store/interface.js";
import { ISetupVectorStoreUseCase } from "./interface.js";
import { IRepository } from "src/infra/repository/interface.js";

export class SetupVectorStoreUseCase implements ISetupVectorStoreUseCase {
    constructor (
        private readonly vectorStore: IVectorStore,
        private readonly repository: IRepository,
    ) {}
    
    async run (): Promise<void>
    {
        const dataset = await this.repository.getDump();

        await this.vectorStore.setup(dataset);
    }
}