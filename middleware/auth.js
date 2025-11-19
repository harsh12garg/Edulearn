const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both user and admin tokens
    if (decoded.user) {
      // Regular user token
      req.user = decoded.user;
    } else if (decoded.admin) {
      // Admin token - map admin to user for compatibility
      req.user = {
        id: decoded.admin.id,
        isAdmin: decoded.isAdmin || false
      };
    } else {
      return res.status(401).json({ msg: 'Invalid token structure' });
    }
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
