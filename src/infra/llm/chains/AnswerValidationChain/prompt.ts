export const promptMessage = `
Are you sure that this answer is in the correct format?
If it is a return with type TEXT, ignore this validation.
Do not include any introduction or conclusion. Just respond with the final JSON.
Add colors to the graph.
Consider the format and the response:
--
A json with the following format:
type: string, 
content: 
    labels: string[],
    datasets: [
      label: string[],
      data: any[]
    ]  
    or
    string

--
Response:
{input}
`