const fs = require('fs');
const path = require('path');
const {v4} = require('uuid');
const mimetype = require('mime-types');

class DiskStorage {
  // add a constructor to that can override the destination
  constructor(dest = null) {
    this.dest = path.join(process.env.BASE_DIR, dest || process.env.UPLOAD_DIR);
  }

  getFile(name) {
    const filePath = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, name);
    let mime = mimetype.lookup(filePath);

    if (!mime) {
      mime = 'application/octet-stream';
    }

    try {
      const file = fs.readFileSync(filePath);
      return {
        file,
        filePath,
        mime,
      };
    } catch (e) {
      return null;
    }
  }

  deleteFile(name) {
    return new Promise((resolve, reject)=>{
      const filePath = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, name);
      try {
        fs.readFileSync(filePath);
        fs.unlinkSync(filePath);
        resolve(1);
      } catch (e) {
        reject(e);
      }
    });
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
        cb(null, {
          path: dest,
          size: outStream.bytesWritten, // file size
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

module.exports = DiskStorage;
