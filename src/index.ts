// create a new express app

import express from 'express';

import { NewQuestionUseCase } from './usecases/NewQuestion/index.js';
import { VectorStore } from './infra/llm/vector-store/index.js';
import { RetrieverChain } from './infra/llm/chains/RetrieverChain/index.js';
import { SqlGenerationChain } from './infra/llm/chains/SqlGenerationChain/index.js';
import { InterpreterChain } from './infra/llm/chains/InterpreterChain/index.js';
import { AnswerValidationChain } from './infra/llm/chains/AnswerValidationChain/index.js';
import { BigQueryRepository } from './infra/repository/BigQuery/index.js';
import { LlmProvider } from './infra/llm/index.js';
import { SetupVectorStoreUseCase } from './usecases/Setup/index.js';
import { Router } from './routes/index.js';
import { TokenCounter } from './utils/TokenCounter/index.js';
import { SqlValidationChain } from './infra/llm/chains/SqlValidationChain/index.js';
import { QuestionTranslationChain } from './infra/llm/chains/QuestionTranslationChain/index.js';

const environment:any = process.env;

const app = express();

app.use(express.json());

const tokenCounter = new TokenCounter()

const vectorStore = new VectorStore(
  environment.OPENAI_API_KEY,
  tokenCounter
)

const queryTranslationChain = new QuestionTranslationChain()
const retrieverChain = new RetrieverChain()
const sqlGenerationChain = new SqlGenerationChain()
const sqlValidationChain = new SqlValidationChain()
const interpreterChain = new InterpreterChain()
const answerValidationChain = new AnswerValidationChain()

const bigQueryRepository = new BigQueryRepository(
  environment.BIG_QUERY_KEY,
  environment.BIG_QUERY_PROJECT_ID,
  ["ProdReplica", "TrakingProviders"]
)

const llmProvider = new LlmProvider(
  {
    sqlGenerationChain,
    sqlValidationChain,
    interpreterChain,
    answerValidationChain,
    retrieverChain,
    queryTranslationChain
  },
  vectorStore,
  {
    openAIApiKey: environment.OPENAI_API_KEY,
    verbose: environment.NODE_ENV === 'dev' ? true : false,
    modelName: 'gpt-4-1106-preview',
    temperature: 0,
  }
)

const setupVectorStoreUseCase = new SetupVectorStoreUseCase(vectorStore, bigQueryRepository)
const newQuestionUseCase = new NewQuestionUseCase(llmProvider, bigQueryRepository);

const routes = new Router(newQuestionUseCase, setupVectorStoreUseCase)

const server = routes.init(app);

server.listen(environment.PORT, async () => {
  
  await setupVectorStoreUseCase.run()
  
  console.log('Server is running at http://localhost:' + environment.PORT);
});
