export type Debug = {
    type: 'Emergency' | 'Alert' | 'Critical' | 'Error' | 'Warning' | 'Notice' | 'Info' | 'Debug';
    operation: string;
    data: Object | string;
};
