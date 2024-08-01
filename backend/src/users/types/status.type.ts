export const STATUS = {
    Active: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];
