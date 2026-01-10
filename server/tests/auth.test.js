const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongo;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_key';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  app = require('../app');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Auth routes', () => {
  it('signup should create a user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'alice', email: 'alice@example.com', password: 'password123' })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('alice');
  });

  it('signup should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'bob', email: 'alice@example.com', password: 'password123' })
      .expect(400);
  });

  it('login should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpass' })
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('login should succeed with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('alice@example.com');
  });
});
