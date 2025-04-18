import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        reactCompiler: true,
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    output: 'standalone',
}

export default nextConfig
