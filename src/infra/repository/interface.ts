export interface IRepository {
    query(query: string): Promise<any>
    getDump(): Promise<string>
}