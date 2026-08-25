/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        domains: [
            "res.cloudinary.com"
        ]
    },
    experimental: {
        cpus: 1
    }
};

module.exports = nextConfig
