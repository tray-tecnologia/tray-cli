import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import { appendFile } from 'fs/promises';
import { EOL } from 'os';

import { ApiError } from './errors/ApiError';
import { AuthenticationError } from './errors/AuthenticationError';
import { FailedConfigurationError } from './errors/FailedConfigurationError';
import { FailedRemoveDynamicFile } from './errors/FailedRemoveDynamicFile';
import { FailedRemoveStaticFile } from './errors/FailedRemoveStaticFile';
import { InvalidLayoutError } from './errors/InvalidLayoutError';
import { InvalidOrNotSentParamsError } from './errors/InvalidOrNotSentParamsError';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { UnknownError } from './errors/UnknownError';
import type { ApiAssetContentResponse } from './responses/ApiAssetContentResponse';
import type { ApiAssetsResponse, ThemeAsset } from './responses/ApiAssetsResponse';
import type { ApiConfigurationResponse } from './responses/ApiConfigurationResponse';
import type { ApiCreateThemeResponse } from './responses/ApiCreateThemeResponse';
import type { ApiListThemesResponse } from './responses/ApiListThemesResponse';
import type { Config } from './types/Config';
import type { Debug } from './types/Debug';
import type { SendAsset } from './types/SendAsset';
import { isFileAllowed } from './utils/IsFileAllowed';
import { keysToCamel } from './utils/KeysToCamel';

import pkg from '../package.json';

/**
 * Opencode api main class
 */
export class Api {
  readonly debugFilePath: string = './.debug.sdk.log';
  readonly version: string = '1.0.4';
  readonly url: string = 'https://opencode.tray.com.br/api';
  readonly debug: boolean;
  readonly key: string;
  readonly password: string;
  readonly themeId?: number;
  readonly headers: AxiosRequestHeaders;

  /**
   * Initiate API class instance
   */
  constructor({ key, password, themeId, debug = false }: Config) {
    this.key = key;
    this.password = password;
    this.themeId = themeId;
    this.debug = debug;
    this.headers = {
      Authorization: `Token token=${this.key}_${this.password}`,
      Accept: 'application/json',
      'User-Agent': `${pkg.name}@${pkg.version}`,
    };
  }

  /**
   * Verify response error to detect Authentication error from API
   * @param {AxiosError} error Response error from Axios
   * @return {AuthenticationError | boolean} Returns AuthenticationError instance in case of Authentication error, false otherwise.
   */
  private verifyAuthenticationError(error: AxiosError): AuthenticationError | boolean {
    if (error.response) {
      const { data } = error.response;

      if (
        data.message === 'Token de acesso inválido' &&
        data.code === '00001' &&
        data.status === 401
      ) {
        return new AuthenticationError(data.message, data);
      }
    }

    return false;
  }

  /**
   * Adds operation info log to file with debug enabled
   * @param {string} type Type of message. Allowed: Emergency, Alert, Critical, Error, Warning, Notice Info or Debug
   * @param {string} operation Operation where debug info was generated
   * @param {Object|string} data Data from operation
   * @private
   */
  private generateDebugFile({ type, operation, data }: Debug) {
    if (this.debug) {
      const date = new Date().toLocaleString('pt-br');
      const convertedData = typeof data === 'object' && data !== null ? JSON.stringify(data) : data;
      const dataToWrite = `[${date}] Type: ${type} | Operation: ${operation} | Data: ${convertedData}${EOL}`;

      appendFile(this.debugFilePath, dataToWrite).catch(() => false);
    }
  }

  /**
   * Check configurations files
   * @returns Promise to be resolved. ApiConfigurationResponse if resolved. ApiError otherwise.
   */
  checkConfiguration(): Promise<ApiConfigurationResponse> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/check`,
      method: 'post',
      headers: this.headers,
      params: {
        gem_version: this.version,
      },
    };

    if (this.themeId) {
      config.params.theme_id = this.themeId;
    }

    return axios
      .request(config)
      .then((response) => {
        const { authentication, theme_id: themeId = null, preview = null } = response.data;
        const data: ApiConfigurationResponse = { authentication, themeId, preview };

        this.generateDebugFile({
          type: 'Info',
          operation: 'checkConfiguration',
          data: response.data,
        });
        return Promise.resolve(data);
      })
      .catch((error: AxiosError) => {
        let sdkError;

        sdkError = this.verifyAuthenticationError(error);

        if (!sdkError) {
          if (error.response && 'authentication' in error.response.data) {
            sdkError = new FailedConfigurationError(error.response.data);
          }
        }

        this.generateDebugFile({ type: 'Error', operation: 'checkConfiguration', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Clean cache for a theme on store
   * @param {number|null} themeId Theme id to clean cache.
   * @returns Promise Return true with promises resolve, or ApiError otherwise.
   */
  cleanCache(themeId = this.themeId): Promise<boolean> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/clean_cache/`,
      method: 'post',
      headers: this.headers,
      params: {
        theme_id: themeId,
        gem_version: this.version,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        if (response.data.response.code !== 200) {
          throw new UnknownError(`Unknown error. Details: ${response.data.response.message}`);
        }

        this.generateDebugFile({ type: 'Info', operation: 'cleanCache', data: response.data });
        return Promise.resolve(true);
      })
      .catch((error: AxiosError | ApiError) => {
        let sdkError;

        if (error instanceof ApiError) {
          sdkError = error;
        } else {
          sdkError = this.verifyAuthenticationError(error);
        }

        this.generateDebugFile({ type: 'Error', operation: 'cleanCache', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Get a list of all themes available at store
   * @returns Promise ApiListThemesResponse if promise resolves, or ApiError otherwise.
   */
  getThemes(): Promise<ApiListThemesResponse> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/list`,
      method: 'get',
      headers: this.headers,
      params: {
        gem_version: this.version,
      },
    };

    return axios
      .request<ApiListThemesResponse>(config)
      .then((response) => {
        this.generateDebugFile({ type: 'Info', operation: 'getThemes', data: response.data });
        return Promise.resolve(response.data);
      })
      .catch((error: AxiosError) => {
        const sdkError = this.verifyAuthenticationError(error);

        this.generateDebugFile({ type: 'Error', operation: 'getThemes', data: error });

        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Create a new theme on store.
   * @param name Name of the new theme
   * @param base Name of the base theme
   * @returns Promise ApiCreateThemeResponse if promise resolves, or ApiError otherwise.
   */
  createTheme(name: string, base: string = 'default'): Promise<ApiCreateThemeResponse> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes`,
      method: 'post',
      headers: this.headers,
      params: {
        gem_version: this.version,
      },
      data: {
        theme: {
          name,
          theme_base: base,
          gem_version: this.version,
        },
      },
    };

    return axios
      .request(config)
      .then((response) => {
        const { theme_id: themeId, preview, published } = response.data;
        const data: ApiCreateThemeResponse = { themeId, name, preview, published };

        this.generateDebugFile({ type: 'Info', operation: 'createTheme', data: response.data });
        return Promise.resolve(data);
      })
      .catch((error: AxiosError) => {
        let sdkError = this.verifyAuthenticationError(error);

        if (!sdkError && error.response && error.response.data.code === '00101') {
          sdkError = new InvalidOrNotSentParamsError(error.response.data);
        }

        this.generateDebugFile({ type: 'Error', operation: 'createTheme', data: error });

        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Delete a theme from store
   * @param id Theme id to delete
   * @returns Promise Return true with promises resolve, or ApiError otherwise.
   */
  deleteTheme(id: number): Promise<boolean> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes/${id}`,
      method: 'delete',
      headers: this.headers,
      params: {
        gem_version: this.version,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        this.generateDebugFile({ type: 'Info', operation: 'deleteTheme', data: response.data });
        return Promise.resolve(true);
      })
      .catch((error: AxiosError) => {
        let sdkError = this.verifyAuthenticationError(error);

        if (!sdkError && error.response && error.response.data.message) {
          if (error.response.data.message.includes("undefined method `id'")) {
            this.generateDebugFile({
              type: 'Info',
              operation: 'deleteTheme',
              data: error.response.data,
            });
            return Promise.resolve(true);
          }

          if (error.response.data.code === '00301') {
            sdkError = new InvalidLayoutError(error.response.data);
          }
        }

        this.generateDebugFile({ type: 'Error', operation: 'deleteTheme', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Get theme assets
   * @returns Promise Return assets and total quantity if promise resolves, or ApiError otherwise.
   */
  getAssets(): Promise<ApiAssetsResponse> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes/${this.themeId}/assets`,
      method: 'get',
      headers: this.headers,
      params: {
        gem_version: this.version,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        const assets: ThemeAsset[] = keysToCamel(response.data.assets);
        const quantity: number = response.data.meta.total;
        const data: ApiAssetsResponse = { assets, quantity };

        this.generateDebugFile({ type: 'Info', operation: 'getThemeAssets', data: response.data });
        return Promise.resolve(data);
      })
      .catch((error: AxiosError) => {
        const sdkError = this.verifyAuthenticationError(error);

        this.generateDebugFile({ type: 'Error', operation: 'getThemeAssets', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Get specific theme asset
   * @returns Promise Return asset data if promise resolves, or ApiError otherwise.
   */
  getAsset(asset: string): Promise<ApiAssetContentResponse> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes/${this.themeId}/assets`,
      method: 'get',
      headers: this.headers,
      params: {
        key: asset,
        gem_version: this.version,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        const responseData = keysToCamel(response.data);
        const assetContentBuffer = Buffer.from(responseData.content, 'base64');

        return fileTypeFromBuffer(assetContentBuffer).then((fileType) => {
          const { key, dynamic, publicUrl } = responseData;
          const data: ApiAssetContentResponse = {
            key,
            dynamic: Boolean(dynamic),
            binary: !!fileType,
            content: assetContentBuffer,
            publicUrl,
          };

          this.generateDebugFile({ type: 'Info', operation: 'getThemeAsset', data: response.data });
          return Promise.resolve(data);
        });
      })
      .catch((error: AxiosError) => {
        const sdkError = this.verifyAuthenticationError(error);

        this.generateDebugFile({ type: 'Error', operation: 'getThemeAsset', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }

  /**
   * Send an asset to theme
   * @param {string} asset Asset name like path
   * @param {Buffer} data Asset content
   * @param {boolean} isBinary True if content is binary, false otherwise.
   * @return Promise Return true if promise resolves, or ApiError otherwise.
   */
  sendAsset({ asset, data, isBinary = false }: SendAsset): Promise<boolean> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes/${this.themeId}/assets`,
      method: 'put',
      headers: this.headers,
      data: {
        gem_version: this.version,
        key: asset,
      },
    };

    config.data[isBinary ? 'attachment' : 'value'] = data.toString('base64');

    return isFileAllowed(asset).then(() => {
      return axios
        .request(config)
        .then((response) => {
          this.generateDebugFile({
            type: 'Info',
            operation: 'sendThemeAsset',
            data: response.data,
          });
          return Promise.resolve(true);
        })
        .catch((error: AxiosError) => {
          let sdkError;

          sdkError = this.verifyAuthenticationError(error);

          if (!sdkError && error.response && error.response.data.code === '00101') {
            sdkError = new InvalidOrNotSentParamsError(error.response.data);
          }

          this.generateDebugFile({ type: 'Error', operation: 'sendThemeAsset', data: error });
          return Promise.reject(sdkError || new UnknownError());
        });
    });
  }

  /**
   * Delete asset requested
   * @param {string} asset Asset name to be deleted.
   * @return Promise Return true if promise resolves, or ApiError otherwise.
   */
  deleteAsset(asset: string): Promise<boolean> {
    const config: AxiosRequestConfig = {
      url: `${this.url}/themes/${this.themeId}/assets`,
      method: 'delete',
      headers: this.headers,
      params: {
        key: asset,
        gem_version: this.version,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'deleteThemeAsset',
          data: response.data,
        });
        return Promise.resolve(true);
      })
      .catch((error: AxiosError) => {
        let sdkError = this.verifyAuthenticationError(error);

        if (!sdkError && error.response && error.response.data.message) {
          if (
            error.response.data.message.includes(
              "undefined local variable or method `upfile_updated'"
            )
          ) {
            this.generateDebugFile({
              type: 'Info',
              operation: 'deleteThemeAsset',
              data: error.response.data,
            });
            return Promise.resolve(true);
          }

          if (error.response.data.code === '00101') {
            sdkError = new InvalidOrNotSentParamsError(error.response.data);
          } else if (error.response.data.code === '00102') {
            sdkError = new ResourceNotFoundError(error.response.data);
          } else if (error.response.data.code === '00204') {
            sdkError = new FailedRemoveDynamicFile(error.response.data);
          } else if (error.response.data.code === '00205') {
            sdkError = new FailedRemoveStaticFile(error.response.data);
          }
        }

        this.generateDebugFile({ type: 'Error', operation: 'deleteThemeAsset', data: error });
        return Promise.reject(sdkError || new UnknownError());
      });
  }
}
