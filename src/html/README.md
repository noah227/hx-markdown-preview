# html

## 使用

```shell
npm run build:watch
```

## 注意事项

* router(如果用了的话)需要设成hash的
* 项目中用到的图标推荐使用字体图标，如[iconfont](https://www.iconfont.cn/)
* 打包时限定chunk数量为1，排除chunk加载问题
* ES几没关系，hbx的web引擎支持的
* 如果只是单纯的页面调试，没必要每次都`停止/运行`插件
    * 可以直接`npm run serve`服务提供的地址
    * 如果是已经打开的窗口，直接刷新就行
