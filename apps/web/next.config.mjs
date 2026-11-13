/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ['@library/build'],
  // The Figma plugin panel (apps/figma-plugin) reads icon data from here; its iframe has a null origin.
  async headers() {
    return [{ source: '/data/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  },
};
export default nextConfig;
