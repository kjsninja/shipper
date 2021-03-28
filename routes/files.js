const router = require('express').Router();
const path = require('path');
const mw = require('../middlewares/headers');
const Files = require('../lib/Files');
const mimetype = require('mime-types');
const {unlinkSync} = require('fs');
const FilesModel = require('../models/Files');
const {v4} = require('uuid');

// eslint-disable-next-line max-len
router.post('/', [mw.checkMultipart, new Files('disk').single('file')], async (req, res)=>{
  const payload = {
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    publicKey: v4(),
    privateKey: v4(),
    file: req.file,
    storage: 'disk',
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
});

router.get('/:publicKey', async (req, res) => {
  const file = await FilesModel.getFileByPublicKey(req.params.publicKey);
  if (file) {
    const filePath = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, file.file.originalname);
    let mime = mimetype.lookup(filePath);

    // set only the type if unknown
    if (!mime) {
      mime = 'application/octet-stream';
      res.setHeader('Content-Type', mime);
    }

    res.sendFile(filePath, async (err)=>{
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
    const filePath = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, file.file.originalname);
    try {
      unlinkSync(filePath);
      await FilesModel.updateStatus(0, file.id);
      res.json({
        msg: 'Success',
      });
    } catch (e) {
      res.status(400).json({
        msg: 'File not found',
      });
    }
  } else {
    res.status(400).json({
      msg: 'File not found',
    });
  }
});

module.exports = router;
