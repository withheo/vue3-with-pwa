const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        // '@'는 현재 프로젝트의 client/src/까지의 최종 경로를 의미합니다.
        '@': path.join(__dirname, 'src/'),
      },
      extensions: [".ts", ".js", ".scss"],
    },
  }
})
