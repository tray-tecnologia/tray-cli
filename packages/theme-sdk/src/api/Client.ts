import { AxiosAdapter } from './AxiosAdapter';
import pkg from '../../package.json';
import type {
  ApiResponse,
  Config,
  GeneralResponse,
  ThemeInstall,
  ThemeInstallAsset,
} from '#theme-sdk/types';
import { AuthenticationError, ResponseError } from '#theme-sdk/errors';
import { ValidationError } from '#theme-sdk/errors/ValidationError.ts';

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

  async getThemes(): Promise<void | ApiResponse<ThemeInstall[]>> {
    return this.adapter
      .get<ApiResponse<ThemeInstall[]>>('/theme-installs')
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('getThemes', error);
      });
  }

  async getTheme(id: number): Promise<void | ApiResponse<ThemeInstall>> {
    return this.adapter
      .get<ApiResponse<ThemeInstall>>(`/theme-installs/${id}`)
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('getTheme', error);
      });
  }

  async createCleanTheme(): Promise<void | ApiResponse<ThemeInstall>> {
    return this.adapter
      .post<ApiResponse<ThemeInstall>>(`/theme-installs/create-clean`)
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('createCleanTheme', error);
      });
  }

  async deleteTheme(id: number): Promise<void | ApiResponse<GeneralResponse>> {
    return this.adapter
      .delete<ApiResponse<GeneralResponse>>(`/theme-installs/${id}`)
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('deleteTheme', error);
      });
  }

  async getThemeAssets(id: number): Promise<void | ApiResponse<ThemeInstallAsset[]>> {
    return this.adapter
      .get<ApiResponse<ThemeInstallAsset[]>>(`/theme-installs/${id}/assets`)
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('getThemeAssets', error);
      });
  }

  async getThemeAsset(id: number, themeId: number): Promise<void | ApiResponse<ThemeInstallAsset>> {
    return this.adapter
      .get<ApiResponse<ThemeInstallAsset>>(`/theme-installs/${themeId}/assets/${id}`)
      .then((response) => response)
      .catch((error) => {
        this.handleErrors('getThemeAsset', error);
      });
  }

  private handleErrors(operation: string, error: any): void {
    if (error instanceof ResponseError) {
      switch (error.status) {
        case 401:
          throw new AuthenticationError(error.body);
        case 422:
          throw new ValidationError(error.body);
      }
    }
    throw error;
  }
}
