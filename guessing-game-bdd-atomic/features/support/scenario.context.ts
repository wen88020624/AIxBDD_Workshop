import { Response } from 'supertest';

export class ScenarioContext {
  private lastResponse: Response;
  private contextData: Map<string, any> = new Map();

  getLastResponse(): Response {
    return this.lastResponse;
  }

  setLastResponse(response: Response): void {
    this.lastResponse = response;
  }

  clear(): void {
    this.lastResponse = null;
  }

  reset(): void {
    this.lastResponse = null;
    this.contextData.clear();
  }

  put(key: string, value: any): void {
    this.contextData.set(key, value);
  }

  get(key: string): any {
    return this.contextData.get(key);
  }
}
