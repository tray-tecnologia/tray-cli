export type ThemeSummary = {
    id: string;
    name: string;
    published: boolean;
};

export type ApiListThemesResponse = {
    themes: ThemeSummary[];
};
