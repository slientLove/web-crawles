const srcpath = require('./src');
const md = require('./paths');
const puppeteer = require('puppeteer');      // 用于模拟用户操作获取网络数据
(async () => {
    const brower = await puppeteer.launch();
    const page = await brower.newPage();
    await page.goto("http://pic.sogou.com/pics");
    page.setViewport({ width:1920,height:2000});      // 设置浏览器的视宽，以增大获取的内容
    await page.focus("#query");            // 模拟用户获取焦点事件
    await page.keyboard.sendCharacter("美食");   // 模拟用户输入的搜索内容
    await page.click("#stb")           // 模拟用户点击事件
    console.log('11');
    page.on('load',async (err) => {            // 获取内容完毕事件
          if(err){ console.log(err)}
          console.log("内容加载完毕");
          const srcs = await page.evaluate( () => {    // 异步加载完毕
              // 获取图片操作列表
              const srcs = document.querySelectorAll('.img-hover');     // 里面可以操作dom的api
              return Array.from(srcs).map( imgs => imgs.src)     // 拿到每张图片的src
          });
          console.log(srcs);
          srcs.forEach( async (src) => {
              await page.waitFor(300);          // 暂停一段时间，防止触发反爬虫机制
              await srcpath(src,md);
          })
         await brower.close();            // 关闭浏览器
    })
})();