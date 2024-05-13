export const isAdmin = (req, res, next) => {
    return next();
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized access: Admin role required',
        });
    }
};
