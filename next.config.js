const withImages = require('next-images')
const { withPlugins } = require('next-compose-plugins')

const nextConfig = {
	/*env: {
    API_URL: "https://multikart-graphql-dun.vercel.app/server.js",
    API_URL: "http://localhost:8000/graphql",
  },*/

	serverRuntimeConfig: {
		secret: process.env.APP_SECRET,
	},
	// if you want to run with local graphQl un-comment below one and comment the above code
	publicRuntimeConfig: {
		API_URL: process.env.API_URL,
		SERVER_URL: process.env.SERVER_URL,
		CONTENTS_URL: process.env.CONTENTS_URL,
		WEAVY_BACKEND_URL: process.env.WEAVY_BACKEND_URL,
		MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,

		API_KEY: process.env.API_KEY,
		API_SECRET: process.env.API_SECRET,

		APP_VERSION: process.env.APP_VERSION,
	},

	compiler: {
		styledComponents: true,
	},

	images: {
		disableStaticImages: true,
	},

	webpack(config, options) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})
		return config
	},
}

module.exports = withPlugins([withImages], nextConfig)
