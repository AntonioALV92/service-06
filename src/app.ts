import bodyParser from 'body-parser';
import express from 'express';
import packageJson from '../package.json';
import { validacionCuentasBeneficiariasController } from './controllers';
import { ErrorHandler } from './middlewares/ErrorHandler';
import { JSONSchema } from './middlewares/JSONSchemaValidator';
import { LoggerRequest } from './middlewares/LoggerRequest';
// import { requests } from 'banca-movil-schemas/schemas';
import { Mapper } from './middlewares/Mapper';


const schemas = require('banca-movil-schemas/schemas');
const app: express.Application = express();

app.get('/version', (req, res) => {
    res.json({
        version: packageJson.version,
    });
});
// Middlewares Before controllers
app.use(bodyParser.json());

const schema = schemas.requests.validacionCuentasBeneficiariasRequest;
app.use('/vendedor', [
    LoggerRequest,
    JSONSchema(schema), // Valida petición contra JSON Schema
    Mapper,  // Mapea campos de petición a como se requiere por banxico
    validacionCuentasBeneficiariasController, // Manda la petición a banxico
]);

// Error Handler
app.use(ErrorHandler);

export default app;
