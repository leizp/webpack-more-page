const webpack = require('webpack')
const path = require('path')
const ip = require('ip').address()

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // 打开调式工具，
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: ip,
    // useLocalIp: true,
    compress: true, // 是否压缩
    open: true, // 是否自动打开默认浏览器
    port: 7888, // 端口
    hot: true, // 是否开启热更新
    hotOnly: true,
    https: true,
    overlay: true, // 浏览器上显示错误
    // proxy: { // 设置代理
    //   '^/api': {
    //     target: ''
    //   }
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
}

module.exports = devConfig

