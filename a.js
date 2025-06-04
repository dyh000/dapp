const puppeteer = require('puppeteer-core');

(async () => {
  // 连接到已经运行的 Chrome 实例
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222', // 指定远程调试地址和端口
  });

  // 打开一个新页面
  const page = await browser.newPage();

  // 创建一个新的 CDP 会话
  const cdpSession = await page.target().createCDPSession();

  // 自定义模拟参数
  const iPhone12 = {
    viewport: {
      width: 1512,
      height: 790,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
  };

  // 设置 User-Agent
  await cdpSession.send('Network.setUserAgentOverride', {
    userAgent: iPhone12.userAgent,
  });

  // 设置设备视口参数
  await cdpSession.send('Emulation.setDeviceMetricsOverride', {
    width: iPhone12.viewport.width,
    height: iPhone12.viewport.height,
    deviceScaleFactor: iPhone12.viewport.deviceScaleFactor,
    mobile: iPhone12.viewport.isMobile,
    touch: iPhone12.viewport.hasTouch,
  });

  // 打开目标网址
  await page.goto('https://www.bilinovel.com');

  console.log(
    `Simulating device with width=${iPhone12.viewport.width}, height=${iPhone12.viewport.height}`
  );

  // 监听页面关闭事件
  page.on('close', async () => {
    console.log('The simulated tab was closed. Exiting...');
    process.exit(0); // 结束程序
  });

})();
