import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	experimental: {
		outputFileTracingIncludes: {
			'*': ['node_modules/@sparticuz/chromium/**'],
		},
	} as any,
};

export default nextConfig;
