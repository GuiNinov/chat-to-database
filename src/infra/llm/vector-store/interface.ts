export interface IVectorStore {
    store?: any
    setup(dataset: string): Promise<void>
}