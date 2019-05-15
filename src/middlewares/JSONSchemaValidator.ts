import Ajv from 'ajv';
import { Request, Response } from 'express';
import { Error } from '../models/Error';


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

            res.status(400).send(e);
        }
    };

}
