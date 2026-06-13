const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

module.exports = (req, res, next) => {
  // 1. Grab the authorization header
  const authHeader = req.headers['authorization'];

  // 2. Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided!' });
  }

  // 3. Extract the actual raw token string out of "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decodedPayload = jwt.verify(token, JWT_SECRET);

    // 5. Attach the decoded user data to the request object so the controller can see who is acting
    req.user = decodedPayload;

    // 6. Pass the request forward to the next layer
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token!' });
  }
};