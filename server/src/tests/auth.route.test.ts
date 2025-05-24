import request from 'supertest';
import app from '../app';

describe('Auth routes', () => {
  it('POST /api/auth/login → 200 + { token }', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'u', password: 'p' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /api/auth/me без токена → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me с валидным токеном → 200 + { userId }', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'u', password: 'p' });
    const token = login.body.token;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId');
  });
});
