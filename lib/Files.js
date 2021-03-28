const DiskStorage = require('./Storage/DiskStorage');
const multer = require('multer');
const privateClass = {
  selectStorage: (name)=>{
    switch (name) {
      case 'disk':
        return new DiskStorage();
      default:
        throw Error('not implemented');
    }
  },
};

class Files {
  constructor(storage = 'disk') {
    this.storageType = storage;
    this.storage = privateClass.selectStorage(storage);
    return multer({
      storage: this.storage,
    });
  }

  setStorage(storage) {
    this.storageType = storage;
    this.storage = privateClass.selectStorage(storage);
    return multer({
      storage: this.storage,
    });
  }
}

module.exports = Files;
