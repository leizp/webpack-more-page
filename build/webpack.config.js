'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩混淆js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')
const entrys = require('../src/config/entry')
const htmlArrs = require('../src/config/htmlArrs')

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

function resolve(dir) {
  return path.join(__dirname, dir)
}

let baseConfig = {
  entry: {
    // 多入口文件
    ...entrys
  },
  output: {// 出口文件
    path: path.resolve(__dirname, "../dist"), // 存放位置 ../dist 打包在dist 目录下 不是打包在build/dist 目录下
    // publicPath: './', // 如果添加了 publicPath css-loader 和 js loader 中的 publicPath 就不再起作用
    filename: "js/[name]_[hash].js" // js 打包到js文件下面
  },
  // resolve: {
  //   alias: {
  //     '@': resolve('src')
  //   }
  // },
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
            return 'static/images/[name]_[contenthash].[ext]';
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
    new CleanWebpackPlugin(), // 打包前清除dist文件夹
    new MiniCssExtractPlugin({ // css 输出到css文件夹下
      filename: 'css/[name]_[contenthash].css',
      chunkFilename: 'css/chunk_[contenthash].css'
    })
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
  baseConfig.plugins.push(new HtmlWebpackPlugin(getHtmlConifg(item._html, item.chunks)))
})

module.exports = env => {
  if (env && env.production) {
    return merge(baseConfig, prodConfig);
  } else {
    return merge(baseConfig, devConfig);
  }
}


