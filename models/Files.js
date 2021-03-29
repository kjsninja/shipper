const db = require('../lib/database');

class Files {
  getAll() {
    return db('files');
  }

  getInactiveFiles(minutes = 5) {
    return db('files')
        .whereRaw(`EXTRACT(EPOCH FROM (NOW()::timestamp - updated_at::timestamp)) / 60 >= ${minutes}`)
        .where({
          status: 1,
        });
  }

  getFilesByIp(ip) {
    return db('files').where({ip});
  }

  countFilesByIp(ip, status = 1) {
    return db('files').count('ip').where({ip, status}).first();
  }

  getFileByPublicKey(publicKey, status = 1) {
    return db('files').where({publicKey, status}).first();
  }

  getFileByPrivateKey(privateKey, status = 1) {
    return db('files').where({privateKey, status}).first();
  }

  create(payload) {
    return db('files').insert(payload);
  }

  updateStatus(status, id) {
    return db('files').where({id}).update({
      status,
    });
  }
}

module.exports = new Files();
