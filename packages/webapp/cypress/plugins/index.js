const cypressDotenv = require('./cypress-dotenv');

module.exports = (on, config) => {
  config = cypressDotenv(on, config);
  return config;
};
