import { Request, Response } from "express";
import {Error} from "../models/Error";

const LoggerColors = require('logger-colors');
const logger = new LoggerColors();

export function ErrorHandler(err: any, req: Request, res: Response, next: () => void) {
    const code = err.statusCode ? -err.statusCode : -1;
    const e: Error = {
        code,
        details: err.body,
        message: err.statusMessage || err.message,
    };

    logger.error('ERROR EN EL SERVICIO DE BANXICO:', true);
    logger.error(`STATUS: [${logger.c_white}${code}${logger.c_red}]`, false);
    logger.error('');
    logger.error('BODY');
    logger.error(JSON.stringify(e, LoggerColors.smallJSON), false);
    logger.error('');
    logger.info('----------------------------------------------------');

    res.status(503).send(e);

}
