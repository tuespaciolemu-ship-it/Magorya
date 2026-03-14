import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configurar root para Turbopack
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
}

export default nextConfig
