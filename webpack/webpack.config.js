const path = require("path");
const { getFilePathsRecursive, htmlPluginCreate } = require("./utils/html-plugin-lib")
const CreateFileWebpack = require('create-file-webpack')
const { INDEX_PAGE_FOLDER_NAME, ENTRY_ROOT, DIST_PATH, VIEWS_PATH } = require("./constants");
const webpack = require("webpack");
const fs = require("fs");

const viewsFiles = getFilePathsRecursive(VIEWS_PATH, ['.js', '.html'])
const { htmlJsChunks, htmlPlugins } = htmlPluginCreate(viewsFiles)

console.log(VIEWS_PATH)

module.exports = {
  /*mode: 'development',*/
  entry: {
    [ENTRY_ROOT.name]: ENTRY_ROOT.path,
    ...htmlJsChunks,
  },
  output: {
    path: DIST_PATH,
    filename: `[name].js?v=[hash]`,
    clean: true,
  },
  devServer: {
    static: DIST_PATH,
    hot: false,
    liveReload: true,
    open: true,
    port: process.env.DEV_SERVER_PORT || 3420,
    host: process.env.DEV_SERVER_HOST || 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: {
                list: [
                  {
                    tag: "img",
                    attribute: "src",
                    type: "src",
                  },
                  {
                    tag: "a",
                    attribute: "href",
                    type: "src",
                    filter: (tag, attribute, attributes, resourcePath) => {
                      const hrefValue = attributes[0].value
                      const partials = hrefValue.split("/")
                      const fileName = partials[partials.length - 1]
                      const ext = fileName.split(".")[1]
                      if (ext === "html")
                        return false;

                      return true;
                    }
                  },
                ],
              },
            },
          }
        ]
      },
    ]
  },
  plugins: [
    ...htmlPlugins,
    new CreateFileWebpack({
      path: DIST_PATH,
      fileName: 'index.html',
      content: `<meta http-equiv="Refresh" content="0; url='./views/${INDEX_PAGE_FOLDER_NAME}/index.html'" />`
    }),

    new webpack.ProvidePlugin({
      $: "jquery/dist/jquery.min.js",
      jQuery: "jquery/dist/jquery.min.js",
      "window.jQuery": "jquery/dist/jquery.min.js"
    })
  ],
  //TODO: replace  to prod config
  /*  optimization: {
      minimize: true,
    }*/
};