// Middleware kiểm tra role của user
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Vai trò '${req.user.role}' không có quyền thực hiện hành động này`,
    });
  }
  next();
};

// Middleware bảo vệ cron endpoints bằng secret key
const cronSecret = (req, res, next) => {
  const secret = req.headers['x-cron-secret'];
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized: invalid cron secret' });
  }
  next();
};

module.exports = { authorize, cronSecret };
