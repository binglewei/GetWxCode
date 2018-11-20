module.exports = {
  baseUrl: '/getWxCode/',
  devServer: {
    open: true,
    proxy: {
      '/cgi-bin': {
        target: 'https://api.weixin.qq.com/',
        ws: true,
        changeOrigin: true
      },
      '/wxa': {
        target: 'https://api.weixin.qq.com/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}