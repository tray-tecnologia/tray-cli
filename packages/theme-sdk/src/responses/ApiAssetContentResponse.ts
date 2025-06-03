export type ApiAssetContentResponse = {
    key: string;
    dynamic: boolean;
    binary: boolean;
    content: Buffer;
    publicUrl?: string;
};
