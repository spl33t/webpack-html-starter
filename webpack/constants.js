const path = require("path")

module.exports = {
  DIST_PATH: path.resolve('./dist'),
  VIEWS_PATH: path.resolve('./src/views'),
  ENTRY_ROOT: { name: "_root", path: path.resolve("./src/index.js") },
  INDEX_PAGE_FOLDER_NAME: 'home'
}