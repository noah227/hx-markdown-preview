# hx-markdown-preview

一个好用的markdown渲染插件

## 功能特性

* 多引擎支持
    - [ ] [marked](https://www.npmjs.com/package/marked)
    - [ ] [markdown-it](https://www.npmjs.com/package/markdown-it) markdown-it是插件式的，目前安装的插件如下
        * [markdown-it-task-lists](https://www.npmjs.com/package/markdown-it-task-lists)
        * [markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor) 锚点id生成
          * 未启用，因为已经使用`markdown-it-toc-and-anchor`了
        * [markdown-it-emoji](https://www.npmjs.com/package/markdown-it-emoji) emoji
        * [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) 快捷属性绑定
        * [markdown-it-container](https://www.npmjs.com/package/markdown-it-container) 自定义块信息渲染的
            * 还没有定义块，所以暂未开启
        * [markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub) 角标
        * [markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup) 角标
        * [markdown-it-mark](https://www.npmjs.com/package/markdown-it-mark) 着色标记
        * [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote) 脚标（注解）
            * 暂未启用，因为目前是hash模式，在使用hash的模式下不可用
        * [markdown-it-imsize](https://www.npmjs.com/package/markdown-it-imsize) 图片尺寸定义
            * 未启用，使用了fs，浏览器不适配
            * 已使用[markdown-it-img-resize](https://www.npmjs.com/package/markdown-it-img-resize)处理
        * [markdown-it-ins](https://www.npmjs.com/package/markdown-it-ins) ins标签
        * [markdown-it-toc-and-anchor](https://www.npmjs.com/package/markdown-it-toc-and-anchor)

## todo

- [x] 文件监听更新
- [ ] 初始尺寸设定
  - hbx的createWebView似乎不可以设置初始尺寸，也不支持状态继承
