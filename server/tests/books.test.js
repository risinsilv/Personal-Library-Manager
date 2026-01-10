const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongo;
let token;
let bookId;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_key';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  app = require('../app');

  // Create a user and login to get token
  await request(app)
    .post('/api/auth/signup')
    .send({ username: 'charlie', email: 'charlie@example.com', password: 'password123' })
    .expect(201);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'charlie@example.com', password: 'password123' })
    .expect(200);

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Books routes', () => {
  it('should save a book to the library', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        googleBooksId: 'test-book-1',
        title: 'Test Book',
        authors: ['Tester'],
        description: 'A test book',
        thumbnail: '',
        infoLink: '',
        status: 'Want to Read',
      })
      .expect(201);

    expect(res.body).toHaveProperty('book');
    expect(res.body.book.title).toBe('Test Book');
    bookId = res.body.book._id;
  });

  it('should list saved books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('should update a book status', async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Reading' })
      .expect(200);

    expect(res.body.book.status).toBe('Reading');
  });

  it('should delete a book', async () => {
    await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const listRes = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listRes.body.length).toBe(0);
  });
});
