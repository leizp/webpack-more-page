'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩混淆js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const getHtmlConifg = (name, chunks) => {
  return {
    template: `./src/views/${name}/index.html`,
    filename: `html/${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    // inject: true,
    hash: false, // 开启hash ?[hash]
    chunks: chunks, // 页面需要引入的包
    minify: process.env.NODE_ENV === 'development' ? false : true
  }
}

const htmlArrs = [
  {
    _html: 'home',
    title: '首页',
    chunks: ['home']
  },
  {
    _html: 'login',
    title: '登录页',
    chunks: ['login']
  }
]

module.exports = {
  // mode: 'development', // 模式 development production
  mode: 'production',
  entry: {
    // 多入口文件
    home: ['./src/views/home/index.js'],
    login: './src/views/login/index.js',

  },
  output: {// 出口文件
    path: path.resolve(__dirname, "../dist"), // 存放位置 ../dist 打包在dist 目录下 不是打包在build/dist 目录下
    // publicPath: './', // 如果添加了 publicPath css-loader 和 js loader 中的 publicPath 就不再起作用
    filename: "js/[name]_[hash].js" // js 打包到js文件下面
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 是否压缩
    open: true, // 是否自动打开默认浏览器
    port: 7888, // 端口
    hot: true, // 是否开启热更新
    hotOnly: true,
    overlay: true, // 浏览器上显示错误
    // proxy: { // 设置代理
    //   '^/api': {
    //     target: ''
    //   }
    // }
  },
  // development环境下,配置 devtool:'cheap-module-eval-source-map'
  // production环境下,配置 devtool:'cheap-module-source-map'
  devtool: 'cheap-module-eval-source-map', // 打开调式工具，
  module: {
    rules: [
      {

        test: /\.(png|jpe?g|gif|bmp|svg|swf|mp3|ogg)$/i,
        // loader: 'file-loader', // 处理静态文件
        loader: 'url-loader',
        options: {
          name() {
            if (process.env.NODE_ENV === 'development') {
              return 'static/images/[name].[ext]';
            }
            return 'static/images/[contenthash].[ext]';
          }, // 占位符 name 打包前文件名称， ext 打包前文件类型， hash
          limit: 10, // 限制转base64 否则不转 2048
          publicPath: '../'
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              modules: true, // 开启css打包模式
              hmr: process.env.NODE_ENV === 'development', // development 开启HMR 热更新
              reloadAll: true,
              publicPath: '../',
            },
          },
          // 'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/, // 排除
        use: {
          loader: 'babel-loader'
        },
      },
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({ // 自动打包html 并且把css 和 js 引入这个html下面
    //   template: './src/views/login/index.html',
    //   filename: 'html/login.html'
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve('./src/views/home/index.html'),
    //   filename: 'html/home.html'
    // }),
    new CleanWebpackPlugin(), // 打包前清除dist文件夹
    new MiniCssExtractPlugin({ // css 输出到css文件夹下
      filename: 'css/[name]_[contenthash].css',
      chunkFilename: 'css/chunk_[contenthash].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    usedExports: true, // 开启摇树功能
    minimizer: [new UglifyJsPlugin()],
    splitChunks: { // 抽取公共模块
      chunks: 'all'
    }//默认是支持异步，我们使用all }
  }
}

htmlArrs.map(item => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConifg(item._html, item.chunks)))
})
