var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// Look for .html files
const htmlFiles = [];
const directories = ['src'];
while (directories.length > 0) {
  var directory = directories.pop();
  var dirContents = fs.readdirSync(directory)
    .map(file => path.join(directory, file));

  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    clean: true
  },
  module: {
    rules: [
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
      
    ]
  },
  plugins: [

    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace(path.normalize("src/"), ""),
        inject: true
      })
    )
  ],
};