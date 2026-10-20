import axios, { type AxiosInstance } from 'axios';

import type { ApiClient } from './api-client.js';

export class AxiosApiClient implements ApiClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL = '/api') {
    this.instance = axios.create({ baseURL });
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const response = await this.instance.get<TResponse>(path);
    return response.data;
  }

  async post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    const response = await this.instance.post<TResponse>(path, body);
    return response.data;
  }

  async put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    const response = await this.instance.put<TResponse>(path, body);
    return response.data;
  }

  async delete(path: string): Promise<void> {
    await this.instance.delete(path);
  }
}
