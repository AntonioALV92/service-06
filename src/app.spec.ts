import nock from 'nock';
import app from './app';
import supertest from 'supertest';
import http from 'http';
import routes from '../routes.json';
import * as fixtures from './fixtures';


describe(`al ejecutar el servidor`, () => {
  // nock.disableNetConnect();
  // // Allow localhost connections so we can test local routes and mock servers.
  // nock.enableNetConnect('127.0.0.1');

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

  test(`Al hacer una petición que no cumpla la estructura`, async () => {
    const response = await request
      .post('/general/registroInicial')
      .send({
        name: '33'
      });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe(-1);
    expect(response.body.errors).toBeInstanceOf(Array);
  });


  describe(`al hacer una petición correcta`, () => {

    afterEach(() => {
      nock.cleanAll();
      nock.recorder.clear();
    })

    test(`si el servicio de banxico responde correctamente`, async () => {
      let bodyRequestBanxico:string='';
      let contentTypeRequestBanxico:string='';
      nock(routes.registroInicial)
        .filteringRequestBody(function(body) {
          // Obtenemos el body hacia banxico
          bodyRequestBanxico = body;
          return '*';
        })
        .matchHeader('content-type', function (val) {
          // Obtenemos el contentType enviado hacia banxico
          contentTypeRequestBanxico = val;
          return true;
        })
        .post('')
        .reply(200,{edoPet:0});

      const response = await request
        .post('/general/registroInicial')
        .send({
          name: 33,          
        });
        
        // El body que va hacia el servicio de Banxico debe ser text/plain con
        // una d= al inicio del json, en string el body
        expect(bodyRequestBanxico).toEqual('d='+JSON.stringify({name:33}));
        expect(contentTypeRequestBanxico).toBe('text/plain');

        // Si todo es correcto Banxico retorna un 200
        // console.log("response:", response.header['content-type']);
        expect(response.header['content-type']).toContain('application/json');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ edoPet: 0 });
    });
    

    test(`si el servicio de banxico no responde json`, async() => {
      nock(routes.registroInicial)
        .post('')
        .reply(200,'error banxico string');

      const response = await request
        .post('/general/registroInicial')
        .send({
          name: 33
        });
        
        // Este servicio si debe responder con JSON
        expect(response.header['content-type']).toContain('application/json');
        // Status 503 para indicar que hay error en Banxico
        expect(response.status).toBe(503);
        expect(response.body.code).toEqual(-1);
        expect(response.body.message).toContain('Error al procesar respuesta');
        expect(response.body.message).toContain('error banxico string');
    })



    test(`si el servicio de banxico responde error`, async () => {
      nock(routes.registroInicial)
        .post('')
        .reply(404, fixtures.respuestaErrorBanxico);

      const response = await request
        .post('/general/registroInicial')
        .send({
          name: 33
        });
      expect(response.status).toBe(503);
      // console.log("response.body:", response.body);
      expect(response.body.code).toBe(-404)
      expect(response.body.details)
        .toBe(JSON.stringify(fixtures.respuestaErrorBanxico))
    })
  })
});