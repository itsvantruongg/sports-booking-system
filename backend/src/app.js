const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// ─── Global Middlewares ───────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Đọc cookie (refresh_token)

// ─── Swagger Documentation ────────────────────────────────────
const { specs } = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ─── API Routes ───────────────────────────────────────────────
// Auth (đăng ký, đăng nhập, refresh token, đổi mật khẩu lần đầu)
app.use('/api/auth', require('./routes/auth.routes'));

// Public (không cần đăng nhập)
app.use('/api/public', require('./routes/public.routes'));

// User (cần đăng nhập - role USER)
app.use('/api/users', require('./routes/user.routes'));

// Notifications (cần đăng nhập)
app.use('/api/notifications', require('./routes/notification.routes'));

// Owner (cần đăng nhập - role OWNER)
app.use('/api/owner', require('./routes/owner.routes'));

// Admin (cần đăng nhập - role ADMIN)
app.use('/api/admin', require('./routes/admin.routes'));

// Webhooks & Cron Jobs
app.use('/api', require('./routes/cron.routes'));

// Payments
app.use('/api/payments', require('./routes/payment.routes'));


module.exports = app;
