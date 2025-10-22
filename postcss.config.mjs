const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' 
      ? {
          cssnano: {
            preset: ['advanced', {
              discardComments: { removeAll: true },
              reduceIdents: true,
              mergeRules: true,
              minifySelectors: true,
            }],
          },
        }
      : {}
    ),
  },
};

export default config;
