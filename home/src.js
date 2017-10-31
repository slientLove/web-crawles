const http = require('http');
const https= require('https');
const fs = require('fs');
const {promisify} = require('util');
const writeFile = promisify(fs.writeFile);    // 包装成一个promise对象
module.exports = async (src,dir) => {              // 图片格式是两种格式的，以jpg,png或者以base64位的字符串
     if(/\.(jpg|jpeg|gif|png)$/.test(src)){            // 以图片格式后缀名结尾的就匹配
          await urlToimg(src,dir)
     }else{
         await urlTobase(url,dir)
     }
}
// to images
const urlToimg = promisify ( (url,dir,callback) => {
         const mod = /^http:/.test(url)? http:https;       // 看看请求是以什么方式发起请求的
         const ext = path.extname(url);
         const paths = path.join(dir,`${Date.now()}${ext}`);
         mod.get(url,res => {
             res.pipe(fs.createWriteStream(paths)).on('finish',() => {
                 console.log('文件流写入完毕');
                 callback();
             })
         });
})
const urlTobase = async (base64,dir) => {
    // data:image/jpeg;base64,/asdasda     base64位格式的形式
    const base64s = base64.match(/^data:(.+?);base64,(.+)$/);    // 以非贪婪模式匹配第一个分号,以及后面的内容
    try{
        const ext = base64s[1].split('/')[1].replace('jpeg','jpg');   // 将jpeg的格式替换成jpg
        const files = path.join(dir,`${Date.now()}.${ext}`);
        await writeFile(files,base64s[2],'base64');         // 获取图片格式，形成文件名，然后再将内容写入，以64位的格式写入
        console.log(files);
    }catch(e){
        console.log(e);
    }
}