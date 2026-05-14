const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort('-created_at')
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { is_read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    res.status(200).json(notification);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, is_read: false }, { is_read: true });
    res.status(200).json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
