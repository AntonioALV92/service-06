import { Request, Response } from "express";
import {Error} from "../models/Error";
export function ErrorHandler(err: any, req: Request, res: Response, next: () => void) {
    const code = err.statusCode ? -err.statusCode : -1;
    const e: Error = {
        code,
        details: err.body,
        message: err.statusMessage || err.message,
    };

    res.status(503).send(e);
}
