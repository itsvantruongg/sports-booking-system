import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Giữ các trang đã biên dịch trong bộ nhớ lâu hơn (1 tiếng)
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBuffer: 100,
  },

  // Ép trình biên dịch dùng SWC (nhanh hơn Babel)
  swcMinify: true,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tối ưu hóa việc theo dõi file trên Windows
      config.watchOptions = {
        ignored: ['**/node_modules', '**/backend/**'],
        poll: false,
      };
      
      // Bật bộ nhớ đệm ổ đĩa (Persistent Cache)
      // Giúp chuyển trang và khởi động cực nhanh
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
};

export default nextConfig;
