export interface BaseErrorParams {
  code: string;
  message: string;
}

export interface ResponseErrorParams extends Partial<BaseErrorParams> {
  status: number;
  body: unknown;
}

export interface RequestErrorParams extends Partial<BaseErrorParams> {
  details: string;
  request: object;
}

// ---

export type RequestData = object | FormData | string | null;

export type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, unknown>;
};

export type Config = {
  token: string;
  themeId?: number;
  debug?: boolean;
};

// API Response

export interface ApiResponsePaging {
  number: number;
  size: number;
  total: number;
  from: number;
  to: number;
  links: {
    first_page: string;
    prev_page: string;
    next_page: string | null;
    last_page: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  paging?: ApiResponsePaging;
  filtering?: Record<string, unknown>;
  meta?: { version: string };
}

//

export type Debug = {
  type: 'Emergency' | 'Alert' | 'Critical' | 'Error' | 'Warning' | 'Notice' | 'Info' | 'Debug';
  operation: string;
  data: Object | string;
};

export type SendAsset = {
  asset: string;
  data: Buffer;
  isBinary: boolean;
};

// Responses

export interface GeneralResponse {
  status: 'success' | 'error';
  message: string;
}

export interface ThemeInstall {
  id: number;
  name: string;
  theme_id: number;
  store_id: number;
  checksum: string;
  preview: string;
  screenshot: string | null;
  default: boolean;
  original_theme_id: number | null;
  payment_status: 'APPROVED' | 'CANCELED' | 'CHARGEBACK' | 'SIMULATED' | 'WAITING_PAYMENT';
  date_published: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThemeInstallAsset {
  id: number;
  name: string;
  path: string;
  uri: string | null;
  host: string | null;
  checksum: string | null;
  dynamic: boolean;
  directory_id: number | null;
  theme_id: number;
  store_id: number;
  content?: string | null;
  created_at: string;
  updated_at: string;
}
