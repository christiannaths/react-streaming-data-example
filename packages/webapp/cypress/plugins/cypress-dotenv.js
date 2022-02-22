require('dotenv').config({ path: `.env.local` });

module.exports = (_on, config) => {
  const host = process.env.CYPRESS_HOST || 'localhost';
  const port = process.env.CYPRESS_PORT || 3000;

  if (process.env.CYPRESS_BASE_URL) {
    config.baseUrl = `https://${host}:${port}`;
  }

  return config;
};
