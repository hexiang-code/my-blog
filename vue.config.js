const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
// 开发环境插件
const devPlugins = [
  new CopyPlugin({
    patterns: [
      {
        from: 'node_modules/mavon-editor/dist/highlightjs',
        to: path.resolve(__dirname, './dist/highlightjs') // 插件将会把文件导出于/dist/highlightjs之下
      },
      {
        from: 'node_modules/mavon-editor/dist/markdown',
        to: path.resolve(__dirname, './dist/markdown') // 插件将会把文件导出于/dist/markdown之下
      },
      {
        from: 'node_modules/mavon-editor/dist/katex', // 插件将会把文件导出
        to: path.resolve(__dirname, './dist/katex')
      }
    ]
  })
]

const prodPlugins = [
  new CopyPlugin({
    patterns: [
      {
        from: 'node_modules/mavon-editor/dist/highlightjs',
        to: path.resolve(__dirname, './dist/highlightjs') // 插件将会把文件导出于/dist/highlightjs之下
      },
      {
        from: 'node_modules/mavon-editor/dist/markdown',
        to: path.resolve(__dirname, './dist/markdown') // 插件将会把文件导出于/dist/markdown之下
      },
      {
        from: 'node_modules/mavon-editor/dist/katex', // 插件将会把文件导出
        to: path.resolve(__dirname, './dist/katex')
      }
    ]
  }),

  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: productionGzipExtensions,
    threshold: 2048,
    minRatio: 0.8
  }),
  new webpack.ProgressPlugin((percentage) => {
    console.log(percentage)
  })
]

module.exports = {
  productionSourceMap: false,
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: prodPlugins
      }
    } else {
      return {
        plugins: devPlugins
      }
    }
  }
};
