import bodyParser from 'body-parser';
import express from 'express';
import { RegistroInicialController } from './controllers';
import { ErrorHandler } from './middlewares/ErrorHandler';
import { JSONSchema } from './middlewares/JSONSchemaValidator';
// import { requests } from 'banca-movil-schemas/schemas';

const schemas = require('banca-movil-schemas/schemas');
const app: express.Application = express();


// Middlewares Before controllers
app.use(bodyParser.json());


// Controllers
// Si se desea validar la petición contra un JSON Schema, entonces
// este se debe de agregar en el arreglo de handlers, antes del controller
// app.use('/general', [JSONSchema(testSchema), RegistroInicialController]);
const schema = schemas.requests.RegistroInicialRequest;
app.use('/general', [JSONSchema(schema), RegistroInicialController]);

// Error Handler
app.use(ErrorHandler);

export default app;
