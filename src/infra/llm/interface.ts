export interface ILlmProvider {
    handleQuestion(question: string, sqlExecutionCallBack: (sql: string) => any): Promise<string>

}