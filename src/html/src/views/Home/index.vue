<template>
    <div class="home" :class="bindClass" :style="bindStyle">
        <div v-if="false" id="controls" :class="showRawContentInput && 'raw'">
            <label for="engine-switch">Markdown引擎</label>
            &emsp;
            <select v-model="engine" id="engine-switch">
                <option v-for="engine in supportedEngineList" :key="engine.title" :value="engine.title">
                    {{ engine.title }}
                </option>
            </select>
        </div>
        <div v-if="showRawContentInput" id="raw-input">
            <textarea v-model="markdownContent" rows="10"></textarea>
        </div>
        <div id="render-area" v-html="renderContent"></div>
    </div>
</template>
<style>
</style>
<script lang="ts" setup>
import {getHBuilderX} from "@/hx"
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {colorSchemeMap, getSupportedEngineList, sampleData, TEnvInfo, TSupportedEngineItem} from "@/views/Home";

const markdownContent = ref(sampleData)
// https://zhuanlan.zhihu.com/p/635303307
// https://qa.1r1g.com/sf/ask/4148015791/
// 调试用
const showRawContentInput = process.env.NODE_ENV === "RAW"

const supportedEngineList = computed<TSupportedEngineItem[]>(() => {
    return getSupportedEngineList(envInfo.value)
})

const engine = ref("markdown-it")
watch(() => engine.value, () => {

})
const renderContent = computed(() => {
    const engineRender = supportedEngineList.value.find(({title}) => title === engine.value)?.render
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
                case "resFetchEnvInfo":
                    envInfo.value = {...envInfo.value, ...msg.data}
                    break
                case "resFetchContent":
                    markdownContent.value = msg.data
                    break
            }
        }
    })
}

const envInfo = ref<TEnvInfo>({
    uri: {
        authority: "",
        fragment: "",
        path: "",
        query: "",
        scheme: "",
        fsPath: "",
        fsFolder: "",
    },
    configuration: {
        colorScheme: "Default"
    }
})

const fetchEnvInfo = () => {
    getHBuilderX().postMessage({
        command: "fetchEnvInfo"
    })
}

const fetchContent = () => {
    getHBuilderX().postMessage({
        command: "fetchContent"
    })
}

const bindClass = computed(() => {
    return [
        `color-scheme-${envInfo.value.configuration.colorScheme.replaceAll(/\s/g, "")}`
    ]
})

const bindStyle = computed(() => {
    const {colorScheme} = envInfo.value.configuration
    const [color, backgroundColor] = colorSchemeMap[colorScheme] || colorSchemeMap.Default
    let style: { [index: string]: any } = {
        color, backgroundColor
    }
    return style
})

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
            fetchEnvInfo()
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
    //background: linear-gradient(45deg, pink, #0000), linear-gradient(165deg, aqua, #0000), linear-gradient(285deg, pink, #0000);
    overflow: auto;
}

#controls {
    width: 100%;
    display: flex;
    padding: 12px;
    align-items: center;
    background-color: #f0f0f0;
    box-sizing: border-box;

}

#raw-input {
    width: 100%;

    > textarea {
        width: 100%;
    }
}
</style>

<style lang="scss">
@use "sass:meta";
@import "./styles/highlightjs";
//@import "highlight.js/styles/github-dark.css";
.color-scheme-Default {
    //@include meta.load-css("~@/highlight.js/styles/github.css")
    @include meta.load-css("./styles/github.css")
}

.color-scheme-Monokai {
    //@include meta.load-css("~@/highlight.js/styles/github-dark.css")
    @include meta.load-css("./styles/github-dark.css")
}

.color-scheme-AtomOneDark {
    @include meta.load-css("./styles/github-dark-dimmed.css")
}

#render-area {
    box-sizing: border-box;
    padding: 16px;

    img {
        max-width: 100%;
    }
}
</style>

