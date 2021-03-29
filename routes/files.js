const router = require('express').Router();
const mw = require('../middlewares/headers');
const limit = require('../middlewares/limit');
const Files = require('../lib/Files');
const FileStorage = new Files(process.env.STORAGE_TYPE);
const FilesModel = require('../models/Files');
const {v4} = require('uuid');

router.post('/', [limit.uploadLimit, mw.checkMultipart], (req, res)=>{
  FileStorage.upload()(req, res, async (err) => {
    if (err) {
      res.status(400).json({
        msg: 'An unknown error occurred when uploading.',
      });
    } else {
      if (req.file) {
        const payload = {
          ip: req.ip,
          publicKey: v4(),
          privateKey: v4(),
          file: req.file,
          storage: process.env.STORAGE_TYPE,
        };
        const file = await FilesModel.create(payload);
        if (file) {
          res.json({
            publicKey: payload.publicKey,
            privateKey: payload.privateKey,
          });
        } else {
          res.status(400).json({
            msg: 'Failed to upload a file',
          });
        }
      } else {
        res.status(400).json({
          msg: 'Missing file',
        });
      }
    }
  });
});

router.get('/:publicKey', limit.downloadLimit, async (req, res) => {
  const file = await FilesModel.getFileByPublicKey(req.params.publicKey);
  if (file) {
    const fileObj = await FileStorage.getFile(file);

    if (fileObj) {
      res.setHeader('Content-Type', fileObj.mime);
    }

    res.sendFile(fileObj.filePath, async (err)=>{
      if (err) {
        res.status(400).json({
          msg: 'File not found',
        });
      }
    });
  } else {
    res.status(400).json({
      msg: 'File not found',
    });
  }
});

router.delete('/:privateKey', async (req, res) => {
  const file = await FilesModel.getFileByPrivateKey(req.params.privateKey);
  if (file) {
    const fileResponse = await FileStorage.deleteFile(file);
    if (fileResponse !== 1) {
      res.status(400).json({
        msg: 'File not found',
      });
    } else {
      res.json({
        msg: 'Success',
      });
    }
  } else {
    res.status(400).json({
      msg: 'File not found',
    });
  }
});

module.exports = router;
