// This is a closure function that accepts an array of permitted roles
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    // 1. Ensure the user object exists (passed down from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User context missing!' });
    }

    // 2. Check if the user's role is included in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access Denied. Your role (${req.user.role}) does not have permission to perform this action.` 
      });
    }

    // 3. Clear to pass!
    next();
  };
};