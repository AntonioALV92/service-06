import { Request, Response } from 'express';
import {Error} from '../models/Error';
export function ErrorHandler(err:any, req:Request, res:Response, next:Function){
    let code = err.statusCode?-err.statusCode:-1;
    const e:Error = {
        code: code,
        message: err.statusMessage||err.message,
        details: err.body
    };

    res.status(503).send(e)
}
