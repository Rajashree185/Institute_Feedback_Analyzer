/**
 * Role-Based Access Control (RBAC) Middleware Factory
 * Returns a middleware that checks if the authenticated user's role
 * matches the required role. Returns 403 Forbidden on mismatch.
 *
 * Usage: requireRole('student') or requireRole('teacher')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        error: `Access denied. This route requires '${role}' role.`
      });
    }

    next();
  };
};

module.exports = requireRole;
