const app = require('../src/app');
const API_TOKEN = process.env.API_TOKEN;

const testData = {
  title: 'Test Bookmark',
  url: 'https://testurl.com',
  rating: 4,
  description: 'Test description is super cool'
};

describe('Bookmarks router', () => {  

  // GET requests
  describe('GET /bookmarks', () => {
    it('responds 200 an array of bookmarks"', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
        });
    });

    it('responds 401 when authorization header is not included', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(401);
    });

    it('responds 401 when bearer token is invalid', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', 'Bearer ' + 'some-invalid-token')
        .expect(401);
    });

  });

  // POST requests
  describe('POST /bookmarks', () => {
    it('responds 201 when all data is valid"', () => {
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .send(testData)
        .expect(201);
    });

    it('responds 400 when required field is ommitted', () => {
      const ommittedData = { ...testData };
      delete ommittedData.title;
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .send(ommittedData)
        .expect(400);
    });

    it('responds 400 when field value is invalid', () => {
      const incorrectData = { ...testData };
      incorrectData.rating = 'it sucks';
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .send(incorrectData)
        .expect(400);
    });

    it('responds 401 when bearer token is invalid', () => {
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + 'some-invalid-token')
        .send(testData)
        .expect(401);
    });

  });


  // GET requests for id
  describe('GET /bookmarks/:id', () => {
    it('responds 200 a bookmark object"', () => {
      return supertest(app)
        .get('/bookmarks/1')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
        });
    });

    it('responds 404 when id is not found', () => {
      return supertest(app)
        .get('/bookmarks/17')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .expect(404);
    });

    it('responds 401 when authorization header is not included', () => {
      return supertest(app)
        .get('/bookmarks/1')
        .expect(401);
    });

    it('responds 401 when bearer token is invalid', () => {
      return supertest(app)
        .get('/bookmarks/1')
        .set('Authorization', 'Bearer ' + 'some-invalid-token')
        .expect(401);
    });

  });

  // DELETE requests
  describe('DELETE /bookmarks/:id', () => {
    it('responds 204 when matching bookmark is found and deleted"', () => {
      return supertest(app)
        .delete('/bookmarks/1')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .expect(204);
    });

    it('responds 404 when id is not found', () => {
      return supertest(app)
        .delete('/bookmarks/17')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .expect(404);
    });

    it('responds 401 when bearer token is invalid', () => {
      return supertest(app)
        .delete('/bookmarks/2')
        .set('Authorization', 'Bearer ' + 'some-invalid-token')
        .expect(401);
    });

  });


});