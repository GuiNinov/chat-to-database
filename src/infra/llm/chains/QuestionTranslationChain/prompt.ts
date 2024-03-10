// export const subQuestionsSystemMessage = `
// You are a helpful assistant that generates multiple sub-questions related to an input question. \n
// The goal is to break down the input into a set of sub-problems / sub-questions that can be answers in isolation. \n
// Generate multiple search queries related to: {text} \n
// Output (3 queries):
// `

// export const highAbstractionSystemMessage = `
// You are receiving a set of questions to find database tables from it. \n
// Which high abstraction questions can be generated from the input question in order 
// to guarantee that the user will be able to find the tables in the database? \n
// Generate high abstraction questions related to: {text} \n
// Output (3 questions):
// `

export const questionsLikeMessage = `
Generate 6 other questions like: {text}
`