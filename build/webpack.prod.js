const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map', // 生产环境
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
module.exports = prodConfig
