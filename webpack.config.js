const { getFilePathsRecursive, htmlPluginCreate } = require("./webpack-utils/html-plugin-lib")

const viewsFiles = getFilePathsRecursive('src/views', ['.js', '.html'])

module.exports = {
  mode: 'development',
  entry: {
    ...htmlPluginCreate(viewsFiles, './src/index.js').jsChunks
  },
  output: {
    path: __dirname + '/dist',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
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
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      }
    ]
  },
  plugins: [
    ...htmlPluginCreate(viewsFiles).htmlPlugins
  ],
};