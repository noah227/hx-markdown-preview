const hx = require("hbuilderx")
const Html = require('./html.js')

const showView = () => {
    let webviewPanel = hx.window.createWebView("extensions.previewMD", {
        enableScripts: true
    });
    let webview = webviewPanel.webView
    webview.html = Html()

    webview.onDidReceiveMessage((msg) => {
        const action = msg.command
        switch (action) {
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
}

module.exports = {
    showView
}
