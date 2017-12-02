var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MV_GOOGLE_ANALYTICS_TOKEN: '"a0b0c0d0"',
  AAOKH_FULCRUM_API_KEY: "'" + process.env.AAOKH_FULCRUM_API_KEY + "'",
  AAOKH_FULCRUM_FORM_ID: "'" + process.env.AAOKH_FULCRUM_FORM_ID + "'"
})
