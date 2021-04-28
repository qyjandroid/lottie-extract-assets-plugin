# lottie-extract-assets-plugin
Lottie图片资源提取，生成js文件
配置文件：
```js
[
    "https://xxx/ceremonyBlessingBagFirst/data.json"
]
```

生成格式如下：

```js
window._config = [
    {
        "key": "ceremonyBlessingBagFirst",
        "url": "https://xxx/ceremonyBlessingBagFirst/data.json"
    },
    {
        "key": "ceremonyBlessingBagFirst_img_0.png",
        "url": "https://xxx/ceremonyBlessingBagFirst/images/img_0.png",
        "source": "https://xxx/ceremonyBlessingBagFirst/data.json",
        "lottieName": "ceremonyBlessingBagFirst"
    },
    {
        "key": "ceremonyBlessingBagFirst_img_1.png",
        "url": "https://xxx/ceremonyBlessingBagFirst/images/img_1.png",
        "source": "https://xxx/ceremonyBlessingBagFirst/data.json",
        "lottieName": "ceremonyBlessingBagFirst"
    },
    {
        "key": "ceremonyBlessingBagFirst_img_2.png",
        "url": "https://xxx/ceremonyBlessingBagFirst/images/img_2.png",
        "source": "https://xxx/ceremonyBlessingBagFirst/data.json",
        "lottieName": "ceremonyBlessingBagFirst"
    },
    {
        "key": "ceremonyBlessingBagFirst_img_3.png",
        "url": "https://xxx/ceremonyBlessingBagFirst/images/img_3.png",
        "source": "https://xxx/ceremonyBlessingBagFirst/data.json",
        "lottieName": "ceremonyBlessingBagFirst"
    }
];
```

插件配置：
```js
//to 为相对outPath的相对路径
const to=path.join("lottie", "test");
//configPath 需要提取的lottie配置文件路径
//outFileName 提取的资源保存文件名（使用.js保存）
//to 提取的资源保存路径  （相对于output）
//globalName  提取的资源访问全局对象名称
new LottieExtractAssetsPlugin({configPath:"./lottieConfig.json",to:to,outFileName:"lottie-assets.js",globalName:"window._config"})
```