import request from 'supertest';
import app from '../app';

describe('Pilot routes', () => {
  it('GET /api/pilots → 200 + массив пилотов', async () => {
    const res = await request(app).get('/api/pilots');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // дальше — примеры на создание, получение по id, обновление и удаление
  it('POST /api/pilots → 201 + новый пилот', async () => {
    const res = await request(app)
      .post('/api/pilots')
      .send({ name: 'Test Pilot', license: 'XYZ123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/pilots/:id → 200 + объект пилота', async () => {
    // сначала создаём
    const created = await request(app)
      .post('/api/pilots')
      .send({ name: 'ToFetch', license: 'ABC' });
    const id = created.body.id;
    const res = await request(app).get(`/api/pilots/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  it('PUT /api/pilots/:id → 200 + обновлённый', async () => {
    const created = await request(app)
      .post('/api/pilots')
      .send({ name: 'ToUpdate', license: 'ABC' });
    const id = created.body.id;
    const res = await request(app)
      .put(`/api/pilots/${id}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Name');
  });

  it('DELETE /api/pilots/:id → 204', async () => {
    const created = await request(app)
      .post('/api/pilots')
      .send({ name: 'ToDelete', license: 'ZZZ' });
    const id = created.body.id;
    const res = await request(app).delete(`/api/pilots/${id}`);
    expect(res.status).toBe(204);
  });
});
