const fs = require('fs');
const path = require('path');

class DiskStorage {
  // add a constructor to that can override the destination
  constructor(dest = null) {
    this.dest = path.join(process.env.BASE_DIR, dest || process.env.UPLOAD_DIR);
  }

  getDestination(req, file, cb) {
    // eslint-disable-next-line max-len
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
          path: path, // we are saving it as `uploads/${file.originalname}`
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
