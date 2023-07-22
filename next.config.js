/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "public.blob.vercel-storage.com",
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
      "lh3.googleusercontent.com",
      "www.facebook.com",
      "platform-lookaside.fbsbx.com",
      "ccd1kw3boji7y6xm.public.blob.vercel-storage.com"
    ],
  },
  reactStrictMode: false,
};
