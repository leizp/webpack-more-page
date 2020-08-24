/**
 * 每个页面的webpack 打包配置路由
 */
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

module.exports = htmlArrs
