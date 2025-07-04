import axios from 'axios';
import axiosRetry from 'axios-retry';
import { ResponseError, RequestError } from '../errors';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import type { RequestData, RequestOptions } from '../types';

type Interceptor = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;

export class AxiosAdapter {
  private axios;

  constructor(config: AxiosRequestConfig, requestInterceptors: Interceptor) {
    this.axios = axios.create(config);
    this.setupAxiosRetry();
    this.setInterceptors(requestInterceptors);
  }

  private setupAxiosRetry() {
    axiosRetry(this.axios, {
      retries: 30,
    });
  }

  private setInterceptors(requestInterceptors: Interceptor) {
    this.axios.interceptors.request.clear();

    this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config = requestInterceptors(config);
      return config;
    });

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          return Promise.reject(
            new ResponseError({
              status: error.response.status,
              body: error.response.data,
            })
          );
        }

        if (error.request) {
          return Promise.reject(
            new RequestError({
              details: error.cause?.message ?? error.message,
              request: error.request,
            })
          );
        }

        return Promise.reject(error);
      }
    );
  }

  async get<R>(url: string, options?: RequestOptions): Promise<R> {
    return this.axios
      .get(url, {
        params: options?.params,
        headers: options?.headers as RawAxiosRequestHeaders,
      })
      .then((response) => response.data);
  }

  async post<R>(url: string, data?: RequestData, options?: RequestOptions): Promise<R> {
    return this.axios
      .post(url, data, {
        params: options?.params,
        headers: options?.headers as RawAxiosRequestHeaders,
      })
      .then((response) => (response.data ? response.data : undefined));
  }

  async put<R>(url: string, data?: RequestData, options?: RequestOptions): Promise<R> {
    return this.axios
      .put(url, data, {
        params: options?.params,
        headers: options?.headers as RawAxiosRequestHeaders,
      })
      .then((response) => (response.data ? response.data : undefined));
  }

  async delete<R>(url: string, options?: RequestOptions): Promise<R> {
    return this.axios
      .delete(url, {
        params: options?.params,
        headers: options?.headers as RawAxiosRequestHeaders,
      })
      .then((response) => (response.data ? response.data : undefined));
  }
}
