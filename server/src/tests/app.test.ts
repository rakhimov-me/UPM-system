// server/src/app.test.ts
import request from 'supertest';
import app from '../app';

describe('App integration', () => {
  it('несуществующий маршрут → 404', async () => {
    const res = await request(app).get('/not-found');
    expect(res.status).toBe(404);
  });
});
