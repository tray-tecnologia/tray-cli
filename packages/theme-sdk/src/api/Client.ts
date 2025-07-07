import { AxiosAdapter } from './AxiosAdapter';
import pkg from '../../package.json';
import type {
  ApiResponse,
  Config,
  Debug,
  GeneralResponse,
  ThemeInstall,
  ThemeInstallAsset,
} from '#theme-sdk/types';
import { AssetNotFoundError, AuthenticationError, NotFoundError, ResponseError, ServerError, ThemeNotFoundError, TimeoutError, UnknownError } from '#theme-sdk/errors';
import { ValidationError } from '#theme-sdk/errors/ValidationError.ts';
import { isFileAllowed } from '#theme-sdk/utils/IsFileAllowed.ts';
import { appendFile } from 'node:fs/promises';
import { EOL } from 'node:os';

export class Client {
  private adapter: AxiosAdapter;
  private themeId?: number;
  private debug: boolean;
  private debugFilePath: string = './.debug.sdk.log';

  public static create(config: Config) {
    return new Client(config);
  }

  constructor({ token, themeId, debug = false }: Config) {
    this.themeId = themeId;
    this.debug = debug;
    this.adapter = new AxiosAdapter(
      {
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          'User-Agent': `${pkg.name}@${pkg.version}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
    );
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
   * Get all themes
   * @returns Promise ThemeInstall.
   */
  async getThemes(): Promise<void | ApiResponse<ThemeInstall[]>> {
    return this.adapter
      .get<ApiResponse<ThemeInstall[]>>('/theme-installs')
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'getThemes',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('getThemes', error);
      });
  }

  /**
   * Get a theme by id
   * @returns Promise ThemeInstall.
   */
  async getTheme(): Promise<void | ApiResponse<ThemeInstall>> {
    return this.adapter
      .get<ApiResponse<ThemeInstall>>(`/theme-installs/${this.themeId}`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'getTheme',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('getTheme', error);
      });
  }

  /**
   * Create a clean theme
   * @returns Promise ThemeInstall.
   */
  async createCleanTheme(): Promise<void | ApiResponse<ThemeInstall>> {
    return this.adapter
      .post<ApiResponse<ThemeInstall>>(`/theme-installs/create-clean`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'createCleanTheme',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('createCleanTheme', error);
      });
  }

  /**
   * Delete a theme
   * @returns Promise GeneralResponse.
   */
  async deleteTheme(id: number): Promise<void | ApiResponse<GeneralResponse>> {
    return this.adapter
      .delete<ApiResponse<GeneralResponse>>(`/theme-installs/${id}`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'deleteTheme',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('deleteTheme', error);
      });
  }

  /**
   * Get all assets from a theme
   * @returns Promise ThemeInstallAsset.
   */
  async getThemeAssets(): Promise<void | ApiResponse<ThemeInstallAsset[]>> {
    return this.adapter
      .get<ApiResponse<ThemeInstallAsset[]>>(`/theme-installs/${this.themeId}/assets`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'getThemeAssets',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('getThemeAssets', error);
      });
  }

  /**
   * Get an asset by id
   * @param id Asset id
   * @returns Promise ThemeInstallAsset.
   */
  async getThemeAsset(id: number): Promise<void | ApiResponse<ThemeInstallAsset>> {
    return this.adapter
      .get<ApiResponse<ThemeInstallAsset>>(`/theme-installs/${this.themeId}/assets/${id}`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'getThemeAsset',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('getThemeAsset', error);
      });
  }

  /**
   * Delete an asset by id
   * @param id Asset id
   * @returns Promise GeneralResponse.
   */
  async deleteThemeAsset(id: number): Promise<void | ApiResponse<GeneralResponse>> {
    return this.adapter
      .delete<ApiResponse<GeneralResponse>>(`/theme-installs/${this.themeId}/assets/${id}`)
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'deleteThemeAsset',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('deleteThemeAsset', error);
      });
  }

  /**
   * Create a theme asset
   * @param path Asset path
   * @param content Asset content
   * @returns Promise ThemeInstallAsset.
   */
  async createThemeAsset(path: string, content: string): Promise<void | ApiResponse<ThemeInstallAsset>> {
    return isFileAllowed(path).then(async () => {
      return this.adapter
      .post<ApiResponse<ThemeInstallAsset>>(`/theme-installs/${this.themeId}/assets`, {
        path,
        content,
      })
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'createThemeAsset',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('createThemeAsset', error);
      });
    })
  }

  /**
   * Update a theme asset
   * @param id Asset id
   * @param content Asset content
   * @returns Promise ThemeInstallAsset.
   */
  async updateThemeAsset(id: number, content: string): Promise<void | ApiResponse<ThemeInstallAsset>> {
    return this.adapter
      .put<ApiResponse<ThemeInstallAsset>>(`/theme-installs/${this.themeId}/assets/${id}`, {
        id,
        content,
      })
      .then((response) => {
        this.generateDebugFile({
          type: 'Info',
          operation: 'updateThemeAsset',
          data: response,
        });

        return response;
      })
      .catch((error) => {
        this.handleErrors('updateThemeAsset', error);
      });
  }

  /**
   * Handle errors
   * @param operation Operation where error was generated
   * @param error Error object
   */
  private handleErrors(operation: string, error: any): void {
    this.generateDebugFile({
      type: 'Error',
      operation,
      data: error.body,
    });

    if (error instanceof ResponseError) {
      switch (error.status) {
        case 401:
          throw new AuthenticationError(error.body);
        case 404:
          if(['deleteTheme', 'getTheme'].includes(operation)) {
            throw new ThemeNotFoundError(error.body);
          }

          if(['deleteThemeAsset', 'getThemeAsset', 'updateThemeAsset'].includes(operation)) {
            throw new AssetNotFoundError(error.body);
          }

          throw new NotFoundError(error.body);
        case 422:
          throw new ValidationError(error.body);
        case 504:
          throw new TimeoutError(error.body);
        default:
          if (error.status >= 500) {
            throw new ServerError(error.body);
          }
      }
    }
    
    throw new UnknownError(error.body?.data?.message);
  }
}
