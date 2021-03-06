import http from 'http';
import nock from 'nock';
import supertest from 'supertest';
import packageJson from '../package.json';
import routes from '../routes/routes.json';
import app from './app';
import * as fixtures from './fixtures';
import { validacionCuentasBeneficiariasController } from './controllers/validacionCuentasBeneficiarias.controller';


describe(`al ejecutar el servidor`, () => {

  let server: http.Server;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
  });

  afterAll((done) => {
    server.close(done);
  });


  describe('Al ejecutar un GET /version', () => {
    test(`Debería retornar un JSON con la versión del package.json`, async () => {
      const response = await request
        .get('/version');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.version).toEqual(packageJson.version);
    });
  });

  describe('Al ejecutar un POST /vendedor/validarCuentaBeneficiaria', () => {
    describe(`Si la petición no cumple con la estructura`, () => {
      test(`Debería retornar un 400 con los errores detallados`, async () => {
        const response = await request
          .post('/vendedor/validarCuentaBeneficiaria')
          .send({
            name: '33',
          });
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(-4);
        expect(response.body.errors).toBeInstanceOf(Array);
      });
    });


    describe(`al hacer una petición correcta`, () => {

      afterEach(() => {
        nock.cleanAll();
        nock.recorder.clear();
      });

      test(`si el servicio de banxico responde correctamente`, async () => {
        let bodyRequestBanxico: string = '';
        let contentTypeRequestBanxico: string = '';
        nock(routes.validacionCuentasBeneficiarias)
          .filteringRequestBody((body) => {
            // Obtenemos el body hacia banxico
            bodyRequestBanxico = body;
            return '*';
          })
          .matchHeader('content-type', (val) => {
            // Obtenemos el contentType enviado hacia banxico
            contentTypeRequestBanxico = val;
            return true;
          })
          .post('')
          .reply(200, {
            cr: "2018100940014ec457a683daef1527",
            edoPet: 0,
          });

        const response = await request
          .post('/vendedor/validarCuentaBeneficiaria')
          .send(fixtures.validarCuentaBeneficiariaRequest);

        // El body que va hacia el servicio de Banxico debe ser text/plain con
        // una d= al inicio del json, en string el body
        expect(bodyRequestBanxico).toEqual('d=' + JSON.stringify(fixtures.validarCuentaBeneficiariaRequestBanxico));
        expect(contentTypeRequestBanxico).toBe('text/plain');

        // Si todo es correcto Banxico retorna un 200
        // console.log("response:", response.header['content-type']);
        expect(response.header['content-type']).toContain('application/json');
        expect(response.status).toBe(200);
        // Debería de mapear la respuesta del servicio de banxico
        expect(response.body).toEqual({
          claveRastreo: "2018100940014ec457a683daef1527",
          estadoPeticion: 0,
        });
      });


      test(`si el servicio de banxico no responde json`, async () => {
        nock(routes.validacionCuentasBeneficiarias)
          .post('')
          .reply(200, 'error banxico string');

        const response = await request
          .post('/vendedor/validarCuentaBeneficiaria')
          .send(fixtures.validarCuentaBeneficiariaRequest);

        // Este servicio si debe responder con JSON
        expect(response.header['content-type']).toContain('application/json');
        // Status 503 para indicar que hay error en Banxico
        expect(response.status).toBe(503);
        expect(response.body.code).toEqual(-1);
        expect(response.body.message).toContain('Error al procesar respuesta');
        expect(response.body.message).toContain('error banxico string');
      });



      test(`si el servicio de banxico responde error`, async () => {
        nock(routes.validacionCuentasBeneficiarias)
          .post('')
          .reply(404, fixtures.respuestaErrorBanxico);

        const response = await request
          .post('/vendedor/validarCuentaBeneficiaria')
          .send(fixtures.validarCuentaBeneficiariaRequest);
        expect(response.status).toBe(503);
        // console.log("response.body:", response.body);
        expect(response.body.code).toBe(-404);
        expect(response.body.details)
          .toBe(JSON.stringify(fixtures.respuestaErrorBanxico));
      });
    });
  });

});
