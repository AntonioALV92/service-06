import { Router, Request, Response } from 'express';
import got from 'got';
import { wrap } from 'async-middleware';
import routes from '../../routes.json';


const router: Router = Router();

// La ruta depende de donde se monte este controller en server.ts, en
// este caso este controller está en /general, por lo tanto esta
// ruta está ligada a /general/registroInicial
// Usando 'wrap' no tenemos que hacer try-catch para los métodos async
router.post('/registroInicial', wrap(async (req: Request, res: Response) => {
    const response = await got.post(routes.registroInicial, {
        body: 'd='+JSON.stringify(req.body),
        headers: {
            'Content-Type': 'text/plain'
        }
    });

    try {
        let respuesta = <Request>JSON.parse(response.body);
        res.status(200).send(respuesta);
    } catch (e) {
        throw new Error('Error al procesar respuesta: "' + response.body + '"');
    }
}));

// Export the express.Router() instance to be used by server.ts
export const RegistroInicialController: Router = router;