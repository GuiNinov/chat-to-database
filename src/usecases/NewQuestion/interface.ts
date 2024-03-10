export interface INewQuestionUseCase {
    run(question: string): Promise<string>
}