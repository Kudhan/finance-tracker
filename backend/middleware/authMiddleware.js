import JWT from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: "auth-failed", message: 'Authentication failed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const userToken = JWT.verify(token, process.env.JWT_SECRET);

        // ✅ Set user on req (not on req.body)
        req.user = {
            userId: userToken.userId,
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: "auth-failed", message: 'Authentication failed' });
    }
};

export default authMiddleware;
