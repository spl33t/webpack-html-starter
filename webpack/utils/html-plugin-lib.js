const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ENTRY_ROOT } = require("../constants");

const htmlPluginCreate = (viewsFiles) => {
  const htmlJsChunks = {}

  viewsFiles.forEach(filePath => {
    if (filePath.endsWith('index.js')) {
      const parts = filePath.split('\\')
      htmlJsChunks[parts[parts.length - 2]] = path.normalize(filePath)
    }
  })

  const htmlPlugins = []
  viewsFiles.forEach(filePath => {
    if (filePath.endsWith('.html')) {
      const parts = filePath.split('\\')
      const pageName = parts[parts.length - 2]

      htmlPlugins.push(
        new HtmlWebpackPlugin({
          template: filePath,
          filename: path.relative(path.resolve('./src'), filePath) ,
          inject: true,
          chunks: [ENTRY_ROOT.name, pageName],
        }))
    }
  })

  return {
    htmlJsChunks,
    htmlPlugins
  }
}

const getFilePathsRecursive = (viewsPath, fileExtension) => {

  const filePaths = []

  const getPath = (viewsPath, fileExtension) => {
    const dirContents = fs.readdirSync(viewsPath)
      .map(file => path.join(viewsPath, file))

    filePaths.push(...dirContents.filter(file => file.endsWith(fileExtension)))

    dirContents.forEach(file => {
      if (fs.statSync(file).isDirectory()) {
        return getPath(file, fileExtension)
      }
    })
  }

  if (Array.isArray(fileExtension)) {
    fileExtension.forEach(fileExtension => {
      getPath(viewsPath, fileExtension)
    })
  } else {
    getPath(viewsPath, fileExtension)
  }

  return filePaths
}

module.exports = {
  getFilePathsRecursive,
  htmlPluginCreate
}