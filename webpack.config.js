const path = require("path");
const { getFilePathsRecursive, htmlPluginCreate } = require("./webpack-utils/html-plugin-lib")

const DIST_PATH = path.resolve(__dirname, 'dist');

const viewsFiles = getFilePathsRecursive('src/views', ['.js', '.html'])

module.exports = {
  mode: 'development',
  entry: {
    ...htmlPluginCreate(viewsFiles, './src/index.js').jsChunks
  },
  output: {
    path: DIST_PATH,
    filename: `[name].js?v=[hash]`,
    clean: true,
  },
  devServer: {
    port: 8080,
    static: './dist',
    hot: false,
    liveReload: true,
    open: true,
    port: process.env.PORT || 3420,
    host: process.env.HOST || 'localhost',
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
    ...htmlPluginCreate(viewsFiles).htmlPlugins,
  ],
  //TODO: replace  to prod config
    optimization: {
      minimize: true,
    }
};