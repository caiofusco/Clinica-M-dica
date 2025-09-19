const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function auth(req, res, next){
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({error:'no_token'});
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({error:'bad_token'});
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(err){
    return res.status(401).json({error:'invalid_token'});
  }
}

module.exports = auth;
