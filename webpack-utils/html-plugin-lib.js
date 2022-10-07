const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPluginCreate = (viewsFiles, indexJsPath = '') => {
  const ROOT_JS_CHUNK_NAME = "rootJs"
  const jsChunks = {}

  if (indexJsPath)
    jsChunks[ROOT_JS_CHUNK_NAME] = indexJsPath

  viewsFiles.forEach(filePath => {
    if (filePath.endsWith('.js')) {
      const parts = filePath.split('\\')
      jsChunks[parts[parts.length - 2]] = "./" + path.normalize(filePath)
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
          filename: filePath.replace(path.normalize("src/"), ""),
          inject: true,
          chunks: [ROOT_JS_CHUNK_NAME, pageName],

        }))
    }
  })

  return {
    jsChunks,
    htmlPlugins
  }
}

const getFilePathsRecursive = (viewsPath, fileExtension) => {
  const filePaths = []

  const getPath = (viewsPath, fileExtension) => {
    const dirContents = fs.readdirSync(viewsPath)
      .map(file => path.join(viewsPath, file))

    dirContents.forEach(file => {
      if (fs.statSync(file).isDirectory()) {
        return getPath(file, fileExtension)
      }
      if (file.endsWith(fileExtension)) {
        filePaths.push(file)
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