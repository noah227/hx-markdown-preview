const fs = require("fs")
const path = require("path")

const pluginRoot = path.resolve(__dirname, "../")
const renderRoot = path.resolve(pluginRoot, "src/html")

const {dependencies: _dependencies} = require(path.resolve(renderRoot, "package.json"))

let dependencies = {..._dependencies}
const commentedDataPath = path.resolve(__dirname, "dependencies.commented.json")

let commentedData = {}
if(fs.existsSync(commentedDataPath)) {
    commentedData = JSON.parse(fs.readFileSync(commentedDataPath, {encoding: "utf8"}))
}

const mditPluginData = {}
Object.keys(dependencies).forEach(k => {
    if(k.startsWith("markdown-it-") || k.startsWith("@mdit")) {
        mditPluginData[k] = {
            version: dependencies[k],
            comment: commentedData[k]?.comment || "",
            extraCommentList: commentedData[k]?.extraCommentList
        }
    }
})

fs.writeFileSync(commentedDataPath, JSON.stringify(mditPluginData, null, 4), {encoding: "utf8"})

// console.log(mditPluginList)
// const renderPluginListMd = "## 已支持的markdown-it插件\n" + mditPluginList.map(([k, v]) => `* [${k}@${v}](https://www.npmjs.com/package/${k})`).join("\n")
const renderPluginListMd = "## 已支持的markdown-it插件\n\n" + Object.entries(mditPluginData).map(([k, {version, comment, extraCommentList=[]}]) => {
    const content = `* [${k}@${version}](https://www.npmjs.com/package/${k}) ${comment}`
    const extraContent = extraCommentList.map(s => `\t* ${s}`).join("\n")
    return extraContent ? [content, extraContent].join("\n") : content
}).join("\n")

fs.writeFileSync(path.resolve(__dirname, "supported.plugins.md"), renderPluginListMd, {encoding: "utf8"})