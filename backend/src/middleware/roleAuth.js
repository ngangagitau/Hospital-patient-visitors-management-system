// backend/src/middleware/roleAuth.js
export function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    console.log('[DEBUG requireRole] Required:', role, 'Received:', userRole);
    if (userRole === role) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
  };
}
