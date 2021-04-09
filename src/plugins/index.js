const fs = require('fs');
const request = require('request');
const path = require('path');
const promisify = require('util').promisify;

const fsReadFileAsync = promisify(fs.readFile);

class LottieExtractAssetsPlugin {

    constructor (options) {
    	// 获取插件配置项
        this.filePath = options && options.path ? options.path : "";
        this.outFileName= options && options.outFileName ? options.outFileName : "lottie-assets.js";
    }

    getLink= async(lottieConfig)=>{
        let imgArray=[];
        if(lottieConfig){
            for(let i=0;i<lottieConfig.length;i++){
                const url=lottieConfig[i];
                this.addLottieInfo(url,imgArray);
             const result=  await this.requestLottie(lottieConfig[i]);
             imgArray.push(...result);
            }
        }
      return imgArray;
    }

    addLottieInfo=(url,imgArr)=>{
        const info=this.getLottieInfo(url);
        imgArr.push({
            key:info.name,
            url:url,
         })
    }
    

    readJsonFile= async(assetPath,compilation,cb)=>{
        let lottieConfig= await new Promise((resolve, reject) => {
                fs.readFile(assetPath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try{
                        let curData=data.toString();
                        const config=JSON.parse(curData);
                        resolve(config);
                    }catch(e){
                        reject(e);
                    }
                }
                });
            });
          const imgLink=await this.getLink(lottieConfig);
          let content="window._lottieConfig = "+ JSON.stringify(imgLink)+";";
          compilation.assets[this.outFileName] = {
              // 写入新文件的内容
              source: function() {
                  return content;
              },
              // 新文件大小（给 webapck 输出展示用）
              size: function() {
                  return content.length;
              }
          }
        cb();
    }

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
                    reject(url+"==失败="+e);
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

    getLottieInfo=(url)=>{
      const lastIndex=  url.lastIndexOf("/");
      const curUrlPre=url.substring(0,lastIndex);
      console.log("cur==",curUrlPre);
      const nameLastIndex=  curUrlPre.lastIndexOf("/");
      return {url:curUrlPre,name:curUrlPre.substring(nameLastIndex+1,nameLastIndex.length)}
    }

    apply(compiler) {
        const pluginName=this.constructor.name;
        if(compiler.hooks){
            //每一次编译的时候
            compiler.hooks.emit.tapAsync(pluginName,(compilation,cb)=>{
                if(this.filePath){
                    this.readJsonFile(this.filePath,compilation,cb);
                }else{
                    cb();
                }
            });
        }
    }
  }
  
  module.exports = LottieExtractAssetsPlugin;
