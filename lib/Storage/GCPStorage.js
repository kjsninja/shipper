const fs = require('fs');
const path = require('path');
const {v4} = require('uuid');
const mimetype = require('mime-types');
const GCP = require('../GCP');

class GCPStorage {
  // add a constructor to that can override the destination
  constructor(dest = null) {
    this.dest = path.join(process.env.BASE_DIR, dest || process.env.UPLOAD_DIR);
  }

  async getFile(name) {
    return new Promise((resolve, reject) => {
      GCP.getFile(name).then( (data) => {
        const mime = mimetype.lookup(data.filePath);
        if (!mime) {
          data.mime = 'application/octet-stream';
        }
        resolve(data);
      }).catch( (error) => {
        reject(null);
      });
    });
  }

  deleteFile(name) {
    return GCP.deleteFile(name);
  }

  getDestination(req, file, cb) {
    // eslint-disable-next-line max-len
    const ext = path.extname(file.originalname);
    file.originalname = `${v4()}${ext}`;
    cb(null, path.join(this.dest, file.originalname));
  }

  // function that is called if file was uploaded
  _handleFile(req, file, cb) {
    // make sure folder exist
    try {
      fs.readdirSync(this.dest);
    } catch (e) {
      fs.mkdirSync(this.dest);
    }

    const dest = this.dest;

    this.getDestination(req, file, function(err, path) {
      if (err) return cb(err);

      // we open a stream to write the file in disk
      const outStream = fs.createWriteStream(path);

      // stream the file then pipe (save it)
      // in the path from getDestination function
      file.stream.pipe(outStream);
      outStream.on('error', cb);
      outStream.on('finish', function() {
        // call callback write the
        GCP.createFile(path, file.originalname).then( (data) => {
          fs.unlinkSync(path, cb);
          cb(null, {
            path: dest,
            size: outStream.bytesWritten, // file size
          });
        }).catch( (error) => {
          fs.unlinkSync(path, cb);
        });
      });
    });
  }

  _removeFile(req, file, cb) {
    // if there is problem with the file upload
    // we can remove the created stream in /uploads folder
    fs.unlink(file.path, cb);
  }
}

module.exports = GCPStorage;
