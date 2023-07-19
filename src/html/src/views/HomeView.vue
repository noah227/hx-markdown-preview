<template>
    <div class="home">
        <div id="controls">
            <label for="engine-switch">Markdown引擎</label>
            &emsp;
            <select v-model="engine" id="engine-switch">
                <option v-for="engine in supportedEngineList" :key="engine.title" :value="engine.title">
                    {{ engine.title }}
                </option>
            </select>
        </div>
        <div id="render-area" v-html="renderContent"></div>
    </div>
</template>

<script lang="ts" setup>
import {getHBuilderX} from "@/hx/index"
import {onMounted, nextTick, ref, watch, computed} from "vue";

const marked = require("marked")
const MarkdownIt = require("markdown-it")

const markdownContent = ref("")

type TSupportedEngineItem = {
    title: string
    render: (content: string) => string
}
const supportedEngineList: TSupportedEngineItem[] = [
    {title: "marked", render: marked.parse},
    {
        title: "markdown-it", render: (content: string) => {
            const md = new MarkdownIt()
            return md.render(content)
        }
    },
]

const engine = ref("marked")
watch(() => engine.value, () => {

})
const renderContent = computed(() => {
    const engineRender = supportedEngineList.find(({title}) => title === engine.value)?.render
    return engineRender ? engineRender(markdownContent.value) : "引擎获取失败"
})

/** HBuilderX **/
const initMessage = () => {
    // 事件处理
    getHBuilderX().onDidReceiveMessage((msg: any) => {
        // 这里接收的是dialog创建配置的button被触发的事件
        if (msg.type == 'DialogButtonEvent') {
            let button = msg.button
            if (button == '关闭') {
                getHBuilderX().postMessage({
                    command: "close"
                })
            }
        } else {
            switch (msg.command) {
                case "resFetchContent":
                    markdownContent.value = msg.data
                    break
            }
        }
    })
}

const fetchContent = () => {
    getHBuilderX().postMessage({
        command: "fetchContent"
    })
}

const displayErrorMessage = () => {
    getHBuilderX().postMessage({
        command: "displayError",
        data: "随机信息：" + Math.random().toString(32).slice(2).toUpperCase(),
        timeout: 3000
    })
}
onMounted(() => {
    window.addEventListener('hbuilderxReady', () => {
        initMessage()
        setTimeout(() => {
            fetchContent()
        }, 0)

    })
    setTimeout(() => {

    }, 0)
    nextTick(() => {

    })
})
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: linear-gradient(45deg, pink, #0000), linear-gradient(165deg, aqua, #0000), linear-gradient(285deg, pink, #0000);
}

#controls {
    width: 100%;
    display: flex;
    padding: 12px;
    align-items: center;
    background-color: #f0f0f0;
    box-sizing: border-box;
}
</style>
