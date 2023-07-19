const path = require("path");
const {loadDist} = require("hx-vue-dist-loader")

function Html() {
    const _ = loadDist(path.resolve(__dirname), "./html/dist/index.html")
    console.log(_)
    return loadDist(path.resolve(__dirname), "./html/dist/index.html")
}

module.exports = Html;
