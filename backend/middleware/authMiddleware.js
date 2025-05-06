const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; 
  
   
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Failed to decode token' });
  }
};
const isAdmin = (req, res, next)=>{
  if(!req.user || req.user.role !== 'admin')
  {
      return res.status(403).json({message: 'Access denied. Admin privileges required'});
  }
  next();
}

const isTeacher = (req, res, next)=>{
 
  if(!req.user || req.user.role !== 'teacher')
  {
      return res.status(403).json({message: 'Access denied. Admin privileges required'});
  }
  
  next();
}

module.exports = {authMiddleware, isAdmin, isTeacher};
