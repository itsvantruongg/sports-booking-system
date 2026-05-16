const crypto = require('crypto');

/**
 * Sắp xếp các thuộc tính của object theo alphabet của key
 */
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

/**
 * Tạo VNPay Payment URL
 */
function createPaymentUrl(req, { bookingId, amount, bankCode = '', vnpTmnCode, vnpHashSecret, vnpUrl, vnpReturnUrl }) {
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress || '127.0.0.1';

    const tmnCode = vnpTmnCode || process.env.VNP_TMN_CODE;
    const secretKey = vnpHashSecret || process.env.VNP_HASH_SECRET;
    let url = vnpUrl || process.env.VNP_URL;
    const returnUrl = vnpReturnUrl || process.env.VNP_RETURN_URL;

    const date = new Date();
    const createDate = formatDate(date);
    const orderId = bookingId;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan dat san: ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    // Manual stringify to avoid 'qs' dependency
    const signData = Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');
    
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    
    const finalQuery = Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');
    url += '?' + finalQuery;

    return url;
}

/**
 * Kiểm tra tính hợp lệ của IPN/Return data
 */
function verifyReturnData(query, vnpHashSecret) {
    let vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = vnpHashSecret || process.env.VNP_HASH_SECRET;
    
    const signData = Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');
    
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    return secureHash === signed;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return year + month + day + hours + minutes + seconds;
}

module.exports = {
    createPaymentUrl,
    verifyReturnData
};
