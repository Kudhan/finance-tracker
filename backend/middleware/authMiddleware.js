// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
    console.log('authMiddleware - Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'auth-failed', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // QUICK CHECK: decode without verifying to inspect header & payload
    let decodedNoVerify = null;
    try {
      decodedNoVerify = jwt.decode(token, { complete: true });
      console.log('authMiddleware - decoded token (no verify):', decodedNoVerify);
    } catch (decErr) {
      console.warn('authMiddleware - decode failed:', decErr?.message || decErr);
    }

    // Confirm secret exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('authMiddleware - JWT_SECRET is not set!');
      return res.status(500).json({ status: 'failed', message: 'Server configuration error' });
    }

    // Verify token signature & expiration
    const verified = jwt.verify(token, secret);
    // Attach user; tolerate different claim names
    req.user = {
      userId: verified.userId || verified.id || verified.sub,
      ...(verified || {}),
    };

    next();
  } catch (err) {
    console.error('authMiddleware - verify error:', err && err.message ? err.message : err);
    return res.status(401).json({ status: 'auth-failed', message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
