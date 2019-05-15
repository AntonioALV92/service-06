import { Request, Response } from "express";

const LoggerColors = require('logger-colors');
const logger = new LoggerColors();

const separador = '----------------------------------------------------';



export function LoggerRequest(req: Request, res: Response, next: () => void) {
    logger.info(separador);
    logger.cyan('REQUEST', true);
    logger.cyan('METHOD:\t' + req.method, false);
    logger.cyan('URL:   \t' + req.originalUrl, false);
    logger.cyan('HEADERS:', false);
    logger.cyan(JSON.stringify(req.headers, LoggerColors.smallJSON), false);
    logger.cyan('', false);
    logger.cyan('BODY:', false);
    logger.cyan(JSON.stringify(req.body, LoggerColors.smallJSON), false);
    logger.info(separador);
    next();
}



