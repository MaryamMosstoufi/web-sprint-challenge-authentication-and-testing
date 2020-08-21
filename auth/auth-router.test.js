const supertest = require('supertest');
const server = require('../api/server');

describe('auth-router', () => {
  const testUsername = 'testusername';
  const testPassword = 'testpassword';
  const wrongUsername = 'wrong username';
  const wrongPassword = 'wrongpassword';
  const uniqueUsername = `unique${Math.random()}`;

  it('is able to run tests', () => {
    expect(true).toBeTruthy();
  })

  describe('POST /register', () => {
    it('responds with error if trying to register without username', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({password: testPassword})
        .then(response => {
          expect(response.status).toBe(400);
        })
    })

    it('responds with error if trying to register without password', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({username: testUsername})
        .then(response => {
          expect(response.status).toBe(400);
        })
    })

    it('responds with error if username is not unique', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({username: testUsername, password: testPassword})
        .then(response => {
          expect(response.status).toBe(500);
        })
    })

    it('responds with success if all required fields are included', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({ username: uniqueUsername, password: testPassword })
        .then(response => {
          expect(response.status).toBe(201);
        })
    }) 
  })

  describe('POST /login', () => {
    it('responds with error when trying to login without username', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({password: testPassword})
        .then(response => {
          expect(response.status).toBe(400);
        })
    })

    it('responds with error when trying to login without password', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({username: testUsername})
        .then(response => {
          expect(response.status).toBe(400);
        })
    })

    it('responds with error when trying to login with wrong password', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({ username: testUsername, password: wrongPassword })
        .then(response => {
          expect(response.status).toBe(401);
        })
    })

    it('responds with error when trying to login with wrong username', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({username: wrongUsername, password: testPassword})
        .then(response => {
          expect(response.status).toBe(401)
        })
    })

    it('responds with success if credentials are correct', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({username: testUsername, password: testPassword})
        .then(response => {
          expect(response.status).toBe(200);
        })
    })
  })
})