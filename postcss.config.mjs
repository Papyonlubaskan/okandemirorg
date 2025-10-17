const config = {
  plugins: [
    "@tailwindcss/postcss",
    ...(process.env.NODE_ENV === 'production' 
      ? [
          [
            'cssnano',
            {
              preset: ['advanced', {
                discardComments: { removeAll: true },
                reduceIdents: true,
                mergeRules: true,
                minifySelectors: true,
                autoprefixer: { add: true },
              }],
            },
          ],
        ]
      : []
    ),
  ],
};

export default config;
