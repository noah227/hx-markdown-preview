const marked = require("marked")
const MarkdownIt = require("markdown-it")
const hljs = require("highlight.js")

// import "highlight.js/styles/github.css"

export type TSupportedEngineItem = {
    title: string
    render: (content: string) => string
}

const pathJoin = (...paths: any) => {
    return [...paths].filter(_ => _).join("/").replaceAll(/\/+/g, "/").replaceAll("./", "/")
}

export const getSupportedEngineList = (envInfo: TEnvInfo) => {
    const {uri} = envInfo
    const supportedEngineList: TSupportedEngineItem[] = [
        {title: "marked", render: marked.parse},
        {
            title: "markdown-it", render: (content: string) => {
                const tpl = `<pre class="hljs"><code>@VALUE</code></pre>`
                const md = new MarkdownIt({
                    highlight(str: string, lang: any) {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return tpl.replace("@VALUE", hljs.highlight(str, {language: lang}).value)
                            } catch (e) {
                                console.error(e)
                            }
                        }
                        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
                    }
                })
                const plugins: any[] = [
                    [require("markdown-it-task-lists")],
                    [require("markdown-it-emoji")],
                    [require("markdown-it-attrs")],
                    [require("markdown-it-sub")],
                    [require("markdown-it-sup")],
                    [require("markdown-it-mark")],
                    [require("markdown-it-ins")],
                    // [require("markdown-it-toc-and-anchor").default],
                    [require("markdown-it-img-src-render"), {
                        render(src: string) {
                            return pathJoin(uri.fsFolder, src)
                        }
                    }],
                    [require("markdown-it-img-resize")]
                ]
                plugins.forEach(p => {
                    md.use(...p)
                })
                return md.render(content)
            }
        },
    ]
    return supportedEngineList
}

export const sampleData = `
# Hello

## Basic

- [ ] hello

* 111
* 222

## Code Block

\`\`\` python
class My:
    def __init__(self):
        pass
    
    def __str__():
        return "hello"
print(999)
\`\`\`

\`\`\` js
console.log(1234, "hello")
\`\`\`

## Emoji {.emoji}
:lemon: 

## Others 

![图片](/ddmmm.png#w=100)

* -sub & -sup: OH^-^ + H^+^ = H~2~0
* -mark: ==Hello==
* -ins: ++inserted++
 
`

// 酷黑 | 雅蓝 | 默认（绿柔）| 其他（自定义主题）
export type TColorScheme = "Monokai" | "Atom One Dark" | "Default" | string
type TConfiguration = {
    colorScheme: TColorScheme
}

export type TEnvInfo = {
    uri: {
        authority: string
        fragment: string
        path: string
        query: string
        scheme: string
        // 本地文件路径
        fsPath: string
        fsFolder: string
    },
    configuration: TConfiguration
}
export const colorSchemeMap: { [index: string]: [string, string] } = {
    Monokai: ["#f0f0f0", "rgb(39,40,34)"],
    "Atom One Dark": ["#f0f0f0", "rgb(40,44,53)"],
    Default: ["#222", "rgb(255,250,232)"]
}
