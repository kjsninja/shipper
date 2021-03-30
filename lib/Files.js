const DiskStorage = require('./Storage/DiskStorage');
const GCPStorage = require('./Storage/GCPStorage');
const multer = require('multer');
const FilesModel = require('../models/Files');

const privateClass = {
  selectStorage: (name)=>{
    switch (name) {
      case 'disk':
        return new DiskStorage();
      case 'gcp':
        return new GCPStorage();
      default:
        throw Error('not implemented');
    }
  },
};

class Files {
  constructor(storage = 'disk') {
    this.storageType = storage;
    this.storage = privateClass.selectStorage(storage);
    return this;
  }

  upload() {
    return multer({
      storage: this.storage,
    }).single('file');
  }

  setStorage(storage) {
    this.storageType = storage;
    this.storage = privateClass.selectStorage(storage);
    return multer({
      storage: this.storage,
    });
  }

  async getFile(file) {
    const response = await this.storage.getFile(file.file.originalname);
    if (response) {
      // update the datetime of file
      // to track its activity if someone is using it
      await FilesModel.updateStatus(1, file.id);
    }
    return response;
  }

  deleteFile(file) {
    return new Promise( async (resolve, reject) => {
      const fileResponse = await this.storage.deleteFile(file.file.originalname);
      if (fileResponse !== 1) {
        reject(fileResponse);
      } else {
        await FilesModel.updateStatus(0, file.id);
        resolve(1);
      }
    });
  }
}

module.exports = Files;
