require('dotenv').config();

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client using Application Default Credentials
const storage = new Storage();

class GCP {
  constructor(name) {
    this.storage = storage.bucket(name);
    return this;
  }

  deleteFile(id) {
    return new Promise( async (resolve, reject) => {
      const file = await this.storage.file(id).exists();
      if (file[0] === true) {
        await this.storage.file(id).delete({
          ignoreNotFound: true,
        });
        resolve(1);
      } else {
        reject('DELETE: File not found');
      }
    });
  }

  async getFile(id) {
    return new Promise( async (resolve, reject) => {
      try {
        const fileDownload = await this.storage.file(id).download();
        const fileMetaData = await this.storage.file(id).get();
        resolve({
          file: fileDownload[0],
          mime: fileMetaData[0].metadata.contentType,
          filePath: fileMetaData[0].metadata.selfLink,
        });
      } catch (e) {
        reject('GET: File not found');
      }
    });
  }

  createFile(path, id) {
    return new Promise( async (resolve, reject) => {
      try {
        fs.createReadStream(path)
            .pipe(this.storage.file(id).createWriteStream())
            .on('error', function(err) {
              reject('File not created due to an error.');
            })
            .on('finish', function() {
              resolve(id);
            });
      } catch (e) {
        reject('CREATE: File not found');
      }
    });
  }
}

module.exports = new GCP(process.env.GCP_BUCKET_NAME);
