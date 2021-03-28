const router = require('express').Router();
const mw = require('../middlewares/headers');
const Files = require('../lib/Files');
const FilesModel = require('../models/Files');
const {v4} = require('uuid');

// eslint-disable-next-line max-len
router.post('/', [mw.checkMultipart], (req, res)=>{
  (new Files(process.env.STORAGE_TYPE).single('file'))(req, res, async (err) => {
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

router.get('/:publicKey', async (req, res) => {
  const file = await FilesModel.getFileByPublicKey(req.params.publicKey);
  if (file) {
    const fileObj = new Files(process.env.STORAGE_TYPE).storage.getFile(file.file.originalname);
    res.setHeader('Content-Type', fileObj.mime);

    res.sendFile(fileObj.filePath, async (err)=>{
      if (err) {
        res.status(400).json({
          msg: 'File not found',
        });
      } else {
        // update the datetime of file
        // to track its activity if someone is using it
        await FilesModel.updateStatus(1, file.id);
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
    const fileResponse = await new Files(process.env.STORAGE_TYPE).storage.deleteFile(file.file.originalname);
    if (fileResponse === 0) {
      res.status(400).json({
        msg: 'File not found',
      });
    } else {
      await FilesModel.updateStatus(0, file.id);
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
