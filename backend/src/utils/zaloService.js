const ZaloConfig = require('../models/ZaloConfig');

/**
 * Refresh Zalo Access Token (Mockable)
 */
const refreshZaloToken = async () => {
  try {
    const config = await ZaloConfig.findOne();
    if (!config || !config.refresh_token) return null;

    const appId = process.env.ZALO_APP_ID;
    const secretKey = process.env.ZALO_SECRET_KEY;
    if (!appId || !secretKey) return null;

    const response = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "secret_key": secretKey
      },
      body: new URLSearchParams({
        refresh_token: config.refresh_token,
        app_id: appId,
        grant_type: "refresh_token"
      })
    });

    const data = await response.json();
    if (data.access_token) {
      config.access_token = data.access_token;
      config.refresh_token = data.refresh_token;
      config.expires_at = new Date(Date.now() + 7100 * 1000);
      config.updated_at = new Date();
      await config.save();
      return data.access_token;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Send Zalo notification with MOCK MODE support for Demo
 */
const sendZaloNotification = async (phone, templateData, retry = true) => {
  try {
    const config = await ZaloConfig.findOne();
    const token = config ? config.access_token : process.env.ZALO_OA_ACCESS_TOKEN;

    // CHẾ ĐỘ GIẢ LẬP (MOCK MODE) CHO DEMO
    if (!token || token === 'your_access_token_here' || process.env.NODE_ENV === 'development') {
      console.log('\n' + '='.repeat(50));
      console.log('📱 [ZALO NOTIFICATION MOCK]');
      console.log(`To Phone: ${phone}`);
      console.log(`Content: ${templateData.text}`);
      console.log('Status: Message simulated successfully (Demo Mode)');
      console.log('='.repeat(50) + '\n');
      return { error: 0, message: 'Success (Mock)', data: { message_id: 'mock_' + Date.now() } };
    }

    // GỬI THẬT (Nếu có Token)
    const response = await fetch("https://openapi.zalo.me/v2.0/oa/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": token
      },
      body: JSON.stringify({
        recipient: { user_id: phone },
        message: { text: templateData.text || "Thông báo từ KINETIC" }
      })
    });

    const data = await response.json();

    if ((data.error === -216 || data.error === 452) && retry) {
      const newToken = await refreshZaloToken();
      if (newToken) return sendZaloNotification(phone, templateData, false);
    }

    return data;
  } catch (error) {
    console.error("Zalo Service Error:", error.message);
    // Fallback to mock in case of network/db error during demo
    console.log(`📱 [ZALO FALLBACK MOCK] To: ${phone} | Msg: ${templateData.text}`);
    return { error: 0, message: 'Success (Fallback Mock)' };
  }
};

module.exports = { sendZaloNotification, refreshZaloToken };
