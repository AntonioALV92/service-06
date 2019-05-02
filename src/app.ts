import express from 'express';
import bodyParser from 'body-parser';
import { RegistroInicialController } from './controllers';
import { JSONSchema } from './middlewares/JSONSchemaValidator';
import { ErrorHandler } from './middlewares/ErrorHandler';
const app: express.Application = express();


// Middlewares Before controllers
app.use(bodyParser.json());

let testSchema = {
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'number',
        }
    }};
// };
// JSONSchema.setSchema(testSchema)
// app.use(JSONSchema.validate);

// Controllers
// Si se desea validar la petición contra un JSON Schema, entonces
// este se debe de agregar en el arreglo de handlers, antes del controller
// app.use('/general', [JSONSchema(testSchema), RegistroInicialController]);

app.use('/general', [JSONSchema(testSchema), RegistroInicialController])

// Error Handler
app.use(ErrorHandler);

// app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}/`);
// });

export default app;