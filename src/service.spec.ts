import nock from 'nock';
import * as sv from './service';

test('Prueba1', async () => {
  nock('https://google.com')
    .get('/doodle.png')
    .reply(200, {
      license: {
        key: 'mit'
      },
    });

  const [err, res] = await sv.getDoodle();
  expect(err).toBeNull();
  expect(res).toEqual({
    license: {
      key: 'mit'
    }
  });

  nock.cleanAll(); // Delete Mocks
});

test('Prueba2', async () => {
  const [err, res] = await sv.getDoodle();
  expect(res).toBeUndefined();
  expect(err.statusCode).toBe(404);
});