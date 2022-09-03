const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
//自动打包html文件plugin
const miniCssExtractPlugin = require("mini-css-extract-plugin");
//将css提取为单独文件plugin
const { resolve } = require("path");
const { extension } = require("_art-template@4.13.2@art-template");

module.exports = {
  entry: ["../src/index.jsx", "../src/index.html"], //"./index.js",    设置多个入口时，使用数组即可，入口传入html文件，使html文件支持HMR的热更新
  /*
  入口有三种写法，只传入字符串时是单入口，比如entry:"index.js"，
  传入数组时是多入口，但是生成的chunk也只有一个，比如entry:["index.js","lala.js"]，最终也只打包为一个输出文件
  传入对象时是多入口，对象中的每一个key就生成一个chunk，比如entry:{main:"index.js",lala:["lala1.js","lala2.js"]}
  这里会生成两个文件，main.js和lala.js，其中lala又传入数组，把两个文件lala1.js和lala2.js打包为一个chunk
  */
  output: {
    filename: "js/[name].js",
    // 输出的文件按照自己的文件名命名，并且加入哈希
    path: path.resolve(__dirname, "./server/public"),
    publicPath: "/public",
    clean: false,
    //每次输出先清空文件夹
  },
  module: {
    rules: [
      {
        // oneOf选项让其数组中的所有loader只执行其中一个，提升性能，但是不能有多个loader同时处理一种文件的情况
        // 有的话要按照普通的rules写法，即传入的对象直接是loader的匹配规则
        oneOf: [
          {
            test: /\.less$/,
            use: [
              miniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "less-loader",
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                  },
                },
              },
            ],
          },
          {
            test: /\.s?[ac]ss$/,
            // exclude:/node_modules/,
            //想排除node_modules目录应该这么写，官方的写法
            use: [
              // "style-loader",
              miniCssExtractPlugin.loader, //使用miniCssExtractPlugin.loader取代style-loader，可以将css文件单独打包出来
              "css-loader",
              "sass-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                  },
                },
                //postcss-loader会把css代码转换成package.json中browerslist指定浏览器支持的css代码
              },
            ],
          },
          {
            // babel实现对浏览器的js兼容处理，使用babel-loader，并且加载babel的预设
            test: /\.(m?js)|(jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // 以下是core-js的配置，core-js让babel的polyfill实现按需使用
                    useBuiltIns: "usage",
                    // 指定corejs的版本
                    corejs: {
                      version: 3,
                    },
                    // 指定需要兼容的浏览器版本
                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17",
                    },
                  },
                ],
                ["@babel/preset-react"],
              ],
              // 开启babel的缓存，可以提升速度
              cacheDirectory: true,
            },
          },
          {
            test: /\.(jpg|png|gif|svg|jpeg)$/,
            type: "asset/resource",
            //asset/resource一定要用type选项
            generator: {
              filename: "img/[hash][ext]",
            },
            //generator中的filename是设置输出文件的文件名和存放结构[hash]指的是webpack指定的名字
            //也可以缩短哈希，如[hash:10]就是只使用10为哈希值，[ext]是原来的扩展名
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
            generator: {
              filename: "media/[hash][ext]",
            },
            //asset/resource可以处理任何静态资源，图片和字体都可以
          },
          {
            test: /\.html$/,
            use: ["html-loader"], //只使用单个loader的时候可以使用loader选项，这里写loader:"html-loader是一样的"
            //html-loader将html转为字符串再进行编译输出，可以处理html中的资源标签中的连接，比如img标签的src连接
            //use数组中的每个loader可以扩展成一个对象，里面loader选项自动loader名，options选项指定其他内容
          },
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "../src/index.html",
      chunks: "index",
      filename: "./views/index.html",
    }), //自动打包html文件，传入template参数让自动打包的文件以index.html为基础
    new miniCssExtractPlugin({ filename: "css/[name].css" }), //将css单独打包为文件的plugin，传入一个对象里面的filename选项可以决定打包好的css文件结构和文件名
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    //将dist中的所有内容压缩并提供服务器
    compress: true,
    //压缩代码选项
    port: 8000,
    //端口号
    open: true,
    //自动打开浏览器
    hot: true,
    //每次调试重新编译启用热更新，即每次只重新编译被更改的文件，需要在入口js文件加入判别热更新模块的代码
  },
  mode: "development",
  //   有development开发模式，和production生产模式
  resolve: {
    // resolve是解析模块的规则
    alias: {
      // alias是用自定义的变量名作为一个路径的引用，比如下面的代码就可以让以后想找css文件夹路径时直接写$css就可以
      $css: path.resolve(__dirname, "src/css"),
    },
    // extensions是指定引文件时可以省略的后缀名，并且按照顺序一个一个尝试
    // 比如下面的代码，在一个文件夹中如果有同名为index的三个文件tsx，ts和js的话，引入时如果省略后缀，就会优先引入tsx解析
  },
};
