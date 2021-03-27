const request = require('supertest');
const app = require('../app');

describe('it should return 404 status code in non-existing route', ()=>{
  it('GET /', ()=>{
    return request(app).get('/').expect(404);
  });

  it('GET /files', ()=>{
    return request(app).get('/files').expect(404);
  });
});

describe('it should return 200 status code in existing route', ()=>{
  it('POST /files', ()=>{
    return request(app)
        .post('/files')
        .set('Accept', 'multipart/form-data')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(`{"publicKey":"testkey","privateKey":"testkey"}`);
  });

  it('GET /files/:publicKey', ()=>{
    return request(app).get('/files/MyPublicKey').expect(200);
  });

  it('DELETE /files/:privateKey', ()=>{
    return request(app).delete('/files/MyPrivateKey').expect(200);
  });
});
