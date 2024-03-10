import { BigQuery } from '@google-cloud/bigquery';
import { IRepository } from '../interface.js';

export class BigQueryRepository implements IRepository {
    client: BigQuery;
    
    datasets: string[] = [];

    constructor(
        keyFileName: string,
        projectId: string,
        datasets: string[]
    ) {
        const bigQuery = new BigQuery({
            keyFilename: keyFileName,
            projectId: projectId,
        });

        this.client = bigQuery;
        this.datasets = datasets;
    }

    async query(query: string): Promise<any> {

        const options = {
            query: query,
            location: 'US',
        };

        // Run the query
        const [rows] = await this.client.query(options);


        return rows;
    }

    async getDump(): Promise<string> {
        
        let dump = '';

        await Promise.all(
            this.datasets.map(async (datasetId: string) => {
                const tableSchemas = await this.getAllTableSchemas(datasetId);
                dump += tableSchemas
            })
        );
        
        return dump;
    
    }


    private async getAllTableSchemas(datasetId: string): Promise<string> {
        try {
            // Get the dataset
            const dataset = this.client.dataset(datasetId);

            // Get all tables in the dataset
            const [tables] = await dataset.getTables();

            console.log('Amount of tables in dataset:', tables.length);
            // Object to store table schemas
            let tableSchemas: string = ``;

            // Iterate through each table
            await Promise.all(
                tables.map(async (table: any) => {
                    const tableName = table.id;

                    const [metadata] = await table.getMetadata();

                    const metadataFormatted = metadata.schema.fields.map((field: any) => {
                        return `${field.name}: ${field.type};`;
                    })


                    let schemaString = `
                        ##########
                        TABLE ${datasetId}.${tableName} {
                            ${metadataFormatted.join('\n')}
                        }
                    `

                    tableSchemas += schemaString;
                })
            );

            return tableSchemas;
        } catch (error) {
            console.error('Error fetching BigQuery table schemas:', error);
            throw error;
        }
    }

}