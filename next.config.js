const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return withNextra({
    basePath: isDev ? "" : "/clover-iiif",
    images: {
      unoptimized: true,
    },
    // @TODO: For testing an API route only...uncomment later
    //output: "export",
  });
};
