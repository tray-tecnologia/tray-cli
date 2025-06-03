export type ThemeAsset = {
    id: number;
    name: string;
    path: string;
    uri?: string;
    host?: string;
    checksum?: string;
    dynamic: boolean;
    directoryId: number;
    themeId: number;
    sellerId: number;
    createdAt: string;
    updatedAt: string;
    errorMessage?: string;
};

export type ApiAssetsResponse = {
    assets: ThemeAsset[];
    quantity: number;
};
