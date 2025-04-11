import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ⚠️ Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'bbdhjsuapldrvcinygav.supabase.co'
    ],
  },
};

export default nextConfig;
