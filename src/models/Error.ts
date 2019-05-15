import { ErrorObject } from 'ajv';

export interface Error {
    code: number;
    message: string;
    errors?: ErrorObject[]|null;
    details?: string;
}
