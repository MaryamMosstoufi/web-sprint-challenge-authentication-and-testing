const supertest = require('supertest')
const server = require('../api/server')
// const usersTable = require('../database/user-model')

describe('jokes-router', () => {
  const uniqueUsername = `unique${Math.random()}`;
  const credentials = {
    username: uniqueUsername,
    password: 'testpassword',
    token: ''
  }
  

  it('is able to run tests', () => {
    expect(true).toBeTruthy();
  })

  describe('GET /jokes', () => {
    it('responds with success if credentials are correct', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({ username: credentials.username, password: credentials.password })
        .then(response => {
          return supertest(server)
            .post('/api/auth/login')
            .send({ username: credentials.username, password: credentials.password })
            .then(response => {
              credentials.token = response.body.token;
              return supertest(server)
                .get('/api/jokes')
                .set('authorization', credentials.token)
                .then(resp => {
                  expect(resp.status).toBe(200)
                })
            })
        })
    })

    it('responds with error if authorization is not correct', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({ username: credentials.username, password: credentials.password })
        .then(response => {
          return supertest(server)
            .post('/api/auth/login')
            .send({ username: credentials.username, password: credentials.password })
            .then(response => {
              credentials.token = 'wrongtoken';
              return supertest(server)
                .get('/api/jokes')
                .set('authorization', credentials.token)
                .then(resp => {
                  expect(resp.status).toBe(401)
                })
            })
        })
    })

    it('responds with error if credentials are not provided', () => {
      return supertest(server)
      .get('/api/jokes')
      .then(resp => {
        expect(resp.status).toBe(401)
      })
    })
  })

})