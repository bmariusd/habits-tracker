export interface ApiClient {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse>;
  delete(path: string): Promise<void>;
}

export const ApiClient = {
  $: Symbol.for('@org/data-access/ApiClient'),
};
