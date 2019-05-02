import { Request, Response } from 'express';
import { Error } from '../models/Error';
import Ajv from 'ajv';


export function JSONSchema(schema:object){

    return function (req:Request, res:Response, next:Function):void {
        // console.log("Validating...", req.body);
        // console.log("schema:", schema);
        const ajv = new Ajv({allErrors: true});
        const validate = ajv.compile(schema);
    
        const valid = validate(req.body);
        if(valid){
            next();
        } else {
            const e:Error = {
                code: - validate.errors!.length,
                message:"La petición no cumple con la estructura definida",
                errors: validate.errors
            };
    
            res.status(400).send(e);
        }  
    }

}
