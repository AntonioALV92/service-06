import Ajv from 'ajv';
import { Request, Response } from 'express';
import { Error } from '../models/Error';

const LoggerColors = require('logger-colors');
const logger = new LoggerColors();

export function JSONSchema(schema: object) {

    return (req: Request, res: Response, next: () => void) => {
        const ajv = new Ajv({allErrors: true});
        const validate = ajv.compile(schema);

        const valid = validate(req.body);
        if (valid) {
            next();
        } else {
            const e: Error = {
                code: - validate.errors!.length,
                errors: validate.errors,
                message: "La petición no cumple con la estructura definida",
            };

            logger.error('ERROR DE PETICIÓN', true);
            logger.error(JSON.stringify(e), false);
            logger.error('');
            logger.info('----------------------------------------------------');

            res.status(400).send(e);
        }
    };

}
