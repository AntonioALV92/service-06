import { ErrorObject } from 'ajv';

export interface Error {
    code:number,
    message:string,
    errors?:Array<ErrorObject>|null,
    details?:string,
}