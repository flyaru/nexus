declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(apiKey: string)
    getGenerativeModel(config: { model: string }): { generateContent: (prompt: string) => Promise<any> }
  }
}
