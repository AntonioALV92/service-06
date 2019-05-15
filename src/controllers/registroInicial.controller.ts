import { wrap } from 'async-middleware';
import { Request, Response, Router } from 'express';
import got from 'got';
import routes from '../../routes.json';
import { mapear } from '../middlewares/Mapper';

const router: Router = Router();

// La ruta depende de donde se monte este controller en server.ts, en
// este caso este controller está en /general, por lo tanto esta
// ruta está ligada a /general/registroInicial
// Usando 'wrap' no tenemos que hacer try-catch para los métodos async
router.post("/registroInicial", wrap(async (req: Request, res: Response) => {
    const response = await got.post(routes.registroInicial, {
        body: "d=" + JSON.stringify(req.body),
        headers: {
            "Content-Type": "text/plain",
        },
    });

    try {
        const respuesta = JSON.parse(response.body);
        const respuestaMapeada = mapear(respuesta, {
            dv: 'digitoVerificador',
            edoPet: 'estadoPeticion',
            gId: 'googleId',
        });
        res.status(200).send(respuestaMapeada);
    } catch (e) {
        throw new Error('Error al procesar respuesta: "' + response.body + '"');
    }
}));

// Export the express.Router() instance to be used by server.ts
export const RegistroInicialController: Router = router;
