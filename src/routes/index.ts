import { Application, Request, Response } from "express";
import { INewQuestionUseCase } from "src/usecases/NewQuestion/interface.js";
import { ISetupVectorStoreUseCase } from "src/usecases/Setup/interface.js";

export class Router {
    
    constructor(
        private readonly newQuestionUseCase: INewQuestionUseCase,
        private readonly setupVectorStoreUseCase: ISetupVectorStoreUseCase,
    ){}

    init(app: Application): Application {
        app.get('/', (req: Request, res: Response) => {
            res.send('Hello World');
        });

        app.post('/question', async (req: Request, res: Response) => {
            const { question } = req.body;
            const response = await this.newQuestionUseCase.run(question);
            res.send({
                message: 'Question answered successfully',
                data: response
            });
        });
        
        app.post('/setup', async (req: Request, res: Response) => {
            await this.setupVectorStoreUseCase.run();
            res.send({
                message: 'Setup done'
            });
        });

        return app;
    }
}