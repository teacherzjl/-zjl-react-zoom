/**
 * @author zhangjunling
 * @date 2020/9/2/0002 17:28
 */
const path = require("path");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const common = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除dist文件夹
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 用于压缩css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 处理、打包css文件 功能类似style-loader
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 压缩js文件
const nodeExternals  = require('webpack-node-externals');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; //打包分析报表及优化总结

module.exports = {
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map", //开启调试
  mode: "development", // mode 模式只有 development和production两种，需使用插件在打包时替换process.env.NODE_ENV
  entry: [ path.resolve(__dirname, "../src/main.js")],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../dist"), //output.filename必须是绝对路径，如果是一个相对路径，打包时webpack会抛出异常。
    library: 'zjl-react-zoom', // 指定类库名,主要用于直接引用的方式(好比使用script 标签)

    libraryExport: "default", // 对外暴露default属性，就能够直接调用default里的属性

    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的状况

    libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  },
  devServer: {
    hot: true,
    open: true,
    port: 3008,
    contentBase: path.join(__dirname, "../dist"), //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true //实时刷新
    /*proxy: { // 设置代理
    "/api": {
      target: "http://localhost:3000",
      pathRewrite: {"^/api" : ""}
    }
  },
   before: function(app) {
          apiMocker(app, path.resolve('public/mocker.js'));
   },

  */
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], //在import的时候，可以省略后缀
    alias: {
      "@": path.resolve(__dirname, "../src/"),
      assets: path.resolve(__dirname, "../src/assets/")
    }
  },
  // externals: [nodeExternals()],
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.BannerPlugin("注释内容"), //内置的 BannerPlugin 插件，用于在文件头部输出一些注释信息
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      date: new Date(),
      // options配置
      title: "123",
      filename: "index.html",
      template: path.resolve(__dirname, "../public/index.html"),
      minify: {
        // 压缩选项
        caseSensitive: false, //是否大小写敏感
        collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
        collapseWhitespace: true, //是否去除空格
        removeComments: true, // 移除注释
        removeAttributeQuotes: true, // 移除双引号
        showErrors: true // showErrors 的作用是，如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true
      }
    }),
    new OptimizeCssAssetsPlugin({}), //压缩css
    new UglifyJsPlugin({
      //压缩js
      cache: true, //当js无变化则不压缩
      parallel: true, //是否启用并行压缩
      sourceMap: true
    }),
    /*new BundleAnalyzerPlugin(),*/
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015',"react"]
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: "imgs/[name].[contenthash:5].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/, //排除某些文件：在编译时，不去处理node_modules下面的文件
        use: ["ts-loader"]
      }
    ]
  }
};
