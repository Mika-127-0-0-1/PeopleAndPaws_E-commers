/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        domains: [
            "res.cloudinary.com"
        ]
    },
    staticPageGenerationTimeout: 180,
    experimental: {
        cpus: 1
    }
};

module.exports = nextConfig
