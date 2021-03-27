const router = require('express').Router();
const mw = require('../middlewares/headers');

router.post('/', mw.checkMultipart, (req, res)=>{
  res.json({
    publicKey: 'testkey',
    privateKey: 'testkey',
  });
});

router.get('/:publicKey', (req, res) => {
  res.send('file');
});

router.delete('/:privateKey', (req, res) => {
  res.json({
    msg: 'Success',
  });
});

module.exports = router;
