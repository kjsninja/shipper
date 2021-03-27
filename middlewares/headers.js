module.exports = {
  checkMultipart: (req, res, next)=>{
    if (req.headers.accept.toLowerCase() === 'multipart/form-data') {
      next();
    } else {
      res.status(400).json({
        msg: 'missing header',
      });
    }
  },
};
