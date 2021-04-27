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