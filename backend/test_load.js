const { protect, checkMustChangePassword } = require('./src/middlewares/authMiddleware');
const { register, login, refresh, forceChangePassword } = require('./src/controllers/auth.controller');
console.log('Requirements loaded successfully');
process.exit(0);
