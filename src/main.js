const hx = require("hbuilderx")
const Html = require('./html.js')
const path = require("path")

const showView = () => {
    try {
        let webviewPanel = hx.window.createWebView("extensions.previewMD", {
            enableScripts: true
        });
        let webview = webviewPanel.webView
        webview.html = Html()
        
        webview.onDidReceiveMessage((msg) => {
            const action = msg.command
            switch (action) {
                case "fetchEnvInfo":
                    const config = hx.workspace.getConfiguration()
                    const colorScheme = config.get("editor.colorScheme")
                    hx.window.getActiveTextEditor().then(editor => {
                        const fsPath = editor.document.uri.fsPath
                        webview.postMessage({
                            command: "resFetchEnvInfo",
                            data: {
                                uri: {
                                    ...editor.document.uri,
                                     fsPath,
                                     fsFolder: path.dirname(fsPath)   
                                },
                                configuration: {colorScheme}
                            }
                        })
                    })
                    break;
                case "fetchContent":
                    hx.window.getActiveTextEditor().then(editor => {
                        webview.postMessage({
                            command: "resFetchContent",
                            data: editor.document.getText()
                        })
                    })
                    break;
            }
            if (msg.command == 'alert') {
                hx.window.showInformationMessage(msg.text);
            }
        });
        hx.window.showView({
            viewId: "extensions.previewMD",
            containerId: "rc01"
        })
        
        webview.postMessage({
            command: "test"
        });
        let originPath = ""
        hx.window.getActiveTextEditor().then(editor => {
            originPath = editor.document.uri.path
        })
        // 注册文件监听
        hx.workspace.onDidChangeTextDocument(e => {
            hx.window.getActiveTextEditor().then(editor => {
                if(e.document.uri.path === originPath) {
                    webview.postMessage({
                        command: "resFetchContent",
                        data: editor.document.getText()
                    })
                }
            })
        }) 
        
        hx.workspace.onDidChangeConfiguration(e => {
            const config = hx.workspace.getConfiguration()
            const colorScheme = config.get("editor.colorScheme")
            webview.postMessage({
                command: "resFetchEnvInfo",
                data: {
                    configuration: {colorScheme}
                }
            })
        })
        webviewPanel.onDidDispose(() => {
            console.log(">>>>>>已关闭")
        })
    }
    catch(e){
        hx.window.showView({
            viewId: "extensions.previewMD",
            containerId: "rc01"
        })
    }
}

module.exports = {
    showView
}
