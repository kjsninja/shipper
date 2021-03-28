const request = require('supertest');
const app = require('../app');
const assert = require('assert').strict;
const path = require('path');

describe('it should return 404 status code in non-existing route', ()=>{
  it('GET /', ()=>{
    return request(app).get('/').expect(404);
  });

  it('GET /files', ()=>{
    return request(app).get('/files').expect(404);
  });
});

describe('it should return 200 status code in existing route', ()=>{
  let uploaded = {
    publicKey: '',
    privateKey: '',
  };
  it('POST /files status 200', ()=>{
    return request(app)
        .post('/files')
        .set('Accept', 'multipart/form-data')
        .attach('file', path.join(__dirname, './sample.png'))
        .expect(200)
        .expect('Content-Type', /json/)
        .expect( (res) => {
          assert.equal(res.body.hasOwnProperty('publicKey'), true, 'has publicKey property');
          assert.equal(res.body.hasOwnProperty('privateKey'), true, 'has privateKey property');
          assert.equal(res.body.publicKey != '', true, 'privateKey should not be blank');
          assert.equal(res.body.privateKey != '', true, 'privateKey should not be blank');
          assert.equal(typeof res.body.publicKey, 'string', 'publicKey should be string');
          assert.equal(typeof res.body.privateKey, 'string', 'privateKey should be string');
          if (res.body.publicKey && res.body.privateKey) {
            uploaded = {...res.body};
          }
        });
  });

  it('POST /files no file uploaded', ()=>{
    return request(app)
        .post('/files')
        .set('Accept', 'multipart/form-data')
        .expect(400)
        .expect('Content-Type', /json/);
  });

  it('VALID GET /files/:publicKey', ()=>{
    return request(app).get(`/files/${uploaded.publicKey}`)
        .expect('Content-Type', /image\/png/)
        .expect(200);
  });

  it('INVALID GET /files/:publicKey', ()=>{
    return request(app).get('/files/MyPublicKey').expect(400);
  });

  it('VALID DELETE /files/:privateKey', ()=>{
    return request(app).delete(`/files/${uploaded.privateKey}`).expect(200);
  });

  it('INVALID DELETE /files/:privateKey', ()=>{
    return request(app).delete('/files/MyPrivateKey').expect(400);
  });
});


const Files = require('../lib/Files');
const DiskStorage = require('../lib/Storage/DiskStorage');
describe('Files Unit Tests', ()=>{
  it('disk storage as default storage', ()=>{
    const disk = new Files();
    return assert.equal(disk.storage instanceof DiskStorage, true);
  });

  it('disk storage passed as "disk"', ()=>{
    const disk = new Files('disk');
    return assert.equal(disk.storage instanceof DiskStorage, true);
  });
});
