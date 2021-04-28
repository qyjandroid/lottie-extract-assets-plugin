const fs = require('fs');
const request = require('request');
const path = require('path');
const webpack = require("webpack");

/**
 * 
 * lottie资源提取插件
 * @class LottieExtractAssetsPlugin
 */
class LottieExtractAssetsPlugin {

    constructor (options) {
    	//1:获取 lottie配置文件路径
        this.configPath = options && options.configPath;
        //2:获取输出文件名称
        this.outFileName = options && options.outFileName ? options.outFileName : "lottie-assets.js";
        //生成资源文件的全局名称
        this.globalName = options && options.globalName ? options.globalName : "window._config";

        this.to = options && options.to ? options.to : "dist";
    }

    compilationHook(compilation) {
        const pluginName = this.constructor.name;
        if(compilation.hooks.processAssets){
            //compilation.emitAsset(name, new webpack.sources.RawSource(html, false));
           // 添加资源
            compilation.hooks.processAssets.tapAsync({ name: pluginName, stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS }, async (assets, cb) => {
                if (this.configPath) {
                    await this.readJsonFile(this.configPath, assets);
                    cb();
                } else {
                    cb();
                }
            });
        }else if(compilation.hooks.additionalAssets){
            compilation.hooks.additionalAssets.tapAsync( pluginName,  async (cb) => {
                if (this.configPath) {
                    await this.readJsonFile(this.configPath, compilation.assets);
                    cb();
                } else {
                    cb();
                }
            });
        }else{
            //throw new Error("请升级webpack版本>=4");
            compilation.errors.push("请升级webpack版本>=4");
        } 
    }
    
    /**
     * 
     * 
     * 获取lottie 资源地址。
     * @memberOf LottieExtractAssetsPlugin
     */
    getLink= async(lottieConfig)=>{
        let imgArray=[];
        if(lottieConfig){
            for(let i=0;i<lottieConfig.length;i++){
                const url=lottieConfig[i];
                //添加lottie json
                this.addLottieInfo(url,imgArray);
                //请求lottie json文件，获取图片资源
                const result=  await this.requestLottie(lottieConfig[i]);
                imgArray.push(...result);
            }
        }
      return imgArray;
    }
    /**
     * 
     * 
     * 添加lottie json 文件
     * @memberOf LottieExtractAssetsPlugin
     */
    addLottieInfo=(url,imgArr)=>{
        const info=this.getLottieInfo(url);
        imgArr.push({
            key:info.name,
            url:url,
         })
    }
    
    /**
     * 
     * 
     * 读取配置文件,生成js文件。
     * @memberOf LottieExtractAssetsPlugin
     */
    readJsonFile= async(assetPath,assets)=>{
        //获取配置
        let lottieConfig = await new Promise((resolve, reject) => {
            try {
                //读取配置文件
                fs.readFile(assetPath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        let curData = data.toString();
                        const config = JSON.parse(curData);
                        resolve(config);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
        //根据配置获取资源链接(包含当前的lottie和lottie中图片)
        const imgLink = await this.getLink(lottieConfig);
        // 采用js文件，方便我们前端代码集成使用。
        let content = this.globalName + " = " + JSON.stringify(imgLink, null, 4) + ";";
        const assetsInfo = {
            // 写入新文件的内容
            source: function () {
                return content;
            },
            // 新文件大小（给 webapck 输出展示用）
            size: function () {
                return content.length;
            }
        }
        const fileName = path.join(this.to, this.outFileName);
        assets[fileName]= assetsInfo;
    }
    /**
     * 
     * 
     * 请求lottie json文件
     * @memberOf LottieExtractAssetsPlugin
     */
    requestLottie=  (url)=>{
       return new Promise((resolve,reject)=>{
          request(url,  (error, response, body)=> {
              if (!error && response.statusCode == 200) {
                try{
                  const lottieData=JSON.parse(body);
                  const result= this.lottieParse(lottieData,url);
                  resolve(result);
                }catch(e){
                    console.log(e);
                }
              }else{
                  reject(url+"==失败");
              }
            })
        })
      
    }

    /**
     * 
     * 解析lottie
     * @memberOf LottieExtractAssetsPlugin
     */
    lottieParse=(data,url)=>{
      let urlArray=[];
      try{
          const assets=data.assets;
          const lottieInfo=this.getLottieInfo(url);
          for(let i=0;i<assets.length;i++){
              const item=assets[i];
              if(item.p && item.u){
                  const imgUrl=`${lottieInfo.url}/${item.u}${item.p}`;
                  urlArray.push({
                      key:`${lottieInfo.name}_${item.p}`,
                      url:imgUrl,
                      source:url,
                      lottieName:lottieInfo.name
                  });
              }
          }
        }catch(e){
            console.log(e);
        }
        return urlArray;
    }
    /**
     * 
     * 根据url获取lottie信息，方便生成配置文件。
     * @memberOf LottieExtractAssetsPlugin
     */
    getLottieInfo=(url)=>{
      const lastIndex=  url.lastIndexOf("/");
      const curUrlPre=url.substring(0,lastIndex);
      const nameLastIndex=  curUrlPre.lastIndexOf("/");
      return {url:curUrlPre,name:curUrlPre.substring(nameLastIndex+1,nameLastIndex.length)}
    }
    /**
     * 
     * webpack 插件入口
     * @param {any} compiler 
     * 
     * @memberOf LottieExtractAssetsPlugin
     */
    apply(compiler) {
        const pluginName=this.constructor.name;
        if(compiler.hooks){
            // Webpack 4+ Plugin System
            //TODO 使用该hooks目前可以满足需求，但是会警告，后期查看webpack具体生命周期，替换。
            compiler.hooks.compilation.tap(pluginName, (compilation, compilationParams) => {
                //注意注册事件时机。
                this.compilationHook(compilation);
            });
        }else{
            compilation.errors.push("请升级webpack版本>=4");
        }
    }
  }
  
  module.exports = LottieExtractAssetsPlugin;
