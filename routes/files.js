const router = require('express').Router();
const path = require('path');
const mw = require('../middlewares/headers');
const Files = require('../lib/Files');
const mimetype = require('mime-types');
const {unlinkSync} = require('fs');

// eslint-disable-next-line max-len
router.post('/', [mw.checkMultipart, new Files('disk').single('file')], (req, res)=>{
  res.json({
    publicKey: 'testkey',
    privateKey: 'testkey',
  });
});

router.get('/:publicKey', (req, res) => {
  // eslint-disable-next-line max-len
  const file = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, '3.pdf');
  let mime = mimetype.lookup(file);
  // set only the type if unknown
  if (!mime) {
    mime = 'application/octet-stream';
    res.setHeader('Content-Type', mime);
  }

  res.sendFile(file, (err)=>{
    if (err) {
      res.status(400).json({
        msg: 'File not found',
      });
    }
  });
});

router.delete('/:privateKey', (req, res) => {
  const file = path.join(process.env.BASE_DIR, process.env.UPLOAD_DIR, '3.pdf');
  try {
    unlinkSync(file);
    res.json({
      msg: 'Success',
    });
  } catch (e) {
    res.status(400).json({
      msg: 'File not found',
    });
  }
});

module.exports = router;
