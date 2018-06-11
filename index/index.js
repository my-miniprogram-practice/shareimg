import util from '../utils/util';

const app = getApp();
// const ewmRealWidth = 292;
// const ewmRealHeight = 317;

Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
    contentHeight: 0,
    titleObj: {},
    descObj: {},
    offset: 15,
    bannerHeight: 0,
    lineHeight: 26,
    ewmWidth: 100,
    ewmHeight: 100,
    avatar: '../image/avatar.png',
    username: '你的好友',
    hot: '../image/hot.png',
    playicon: '../image/play.png',
    banner:
      'http://02.imgmini.eastday.com/mobile/20180602/20180602_e24b87efecc240fe3e9c46cdebee8f76_cover_mwpm_05501609.jpg',
    title: '36岁离婚后瘦骨如柴，无戏可拍比鲁豫还可怜，自理更生成这样！',
    source: '明星那点事事',
    date: '2018-06-02 12:29',
    describe:
      '此图片来源于网络张韶涵曾与她的妈妈因为钱的事情闹得不可开交，也被大众都知道，随后张韶涵的事业一直没有...',
    ewm: '../image/ewm.jpg'
  },

  onLoad: function(options) {
    this.initParams().then(() => {
      const {
        title,
        describe,
        windowWidth,
        windowHeight,
        bannerHeight,
        ewmHeight,
        lineHeight
      } = this.data;
      let lineCount1 = 18;
      let lineCount2 = 21;
      // 标题一行字数计算
      if (windowWidth < 375) {
        lineCount1 = 16;
      } else if (windowWidth < 414) {
        lineCount1 = 18;
      } else {
        lineCount1 = 21;
      }
      // 描述一行字数计算
      if (windowWidth < 375) {
        lineCount2 = 18;
      } else if (windowWidth < 414) {
        lineCount2 = 21;
      } else {
        lineCount2 = 24;
      }

      let titleObj = this.optionStr(title, lineCount1);
      let descObj = this.optionStr(describe, lineCount2);
      this.setData({
        titleObj: titleObj
      });
      this.setData({
        descObj: descObj
      });
      this.setData({
        contentHeight:
          bannerHeight +
          titleObj.line * lineHeight +
          descObj.line * lineHeight +
          ewmHeight +
          lineHeight * 3
      });
      this.createImg();
    });
  },

  createImg: function() {
    let ctx = wx.createCanvasContext('myCanvas');
    this.drawSquare(ctx);
    this.drawTitle(ctx);
    this.drawSourceTime(ctx);
    this.drawDescribe(ctx);
    this.drawEwm(ctx);
    this.drawLine(ctx);
    this.drawUser(ctx);
    this.drawBanner(ctx)
      .then(() => {
        ctx.draw();
      })
      .catch(() => {
        ctx.draw();
      });
  },

  initParams: function() {
    let scope = this;
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: function(res) {
          console.log('res::', res);
          scope.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
            bannerHeight: (res.windowWidth * 9) / 16
          });
          resolve();
        }
      });
    });
  },

  /**
   * 将指定字符串按照一行显示指定字数切割成一个数组，并计算出行数（默认一行18个字）
   */
  optionStr: function(str, lineNum = 18) {
    let i = 0;
    let line = 1;
    let optstr = '';
    let list = [];
    for (let item of str) {
      if (item === '\n') {
        list.push(optstr);
        list.push('a');
        i = 0;
        optstr = '';
        line += 1;
      } else if (i === lineNum) {
        list.push(optstr);
        i = 1;
        optstr = item;
        line += 1;
      } else {
        optstr += item;
        i += 1;
      }
    }
    list.push(optstr);
    // console.log('list::', list);
    console.log(line, list);
    return {
      line: line,
      list: list
    };
  },

  // getData: function() {
  //   let i = 0;
  //   let lineNum = 1;
  //   let thinkStr = '';
  //   let titleList = [];
  //   for (let item of this.data.title) {
  //     if (item === '\n') {
  //       titleList.push(thinkStr);
  //       titleList.push('a');
  //       i = 0;
  //       thinkStr = '';
  //       lineNum += 1;
  //     } else if (i === 18) {
  //       titleList.push(thinkStr);
  //       i = 1;
  //       thinkStr = item;
  //       lineNum += 1;
  //     } else {
  //       thinkStr += item;
  //       i += 1;
  //     }
  //   }
  //   titleList.push(thinkStr);
  //   // console.log('titleList::', titleList);
  //   this.setData({ titleList: titleList });
  //   this.createImg(lineNum);
  // },

  drawSquare: function(ctx) {
    const { windowWidth, contentHeight } = this.data;
    ctx.rect(0, 0, windowWidth, contentHeight);
    ctx.setFillStyle('#fff');
    ctx.fill();
  },

  drawBanner: function(ctx) {
    let scope = this;
    const { windowWidth, bannerHeight } = this.data;
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: scope.data.banner,
        success: function(res) {
          console.log(res.path);
          ctx.drawImage(res.path, 0, 0, windowWidth, bannerHeight);
          resolve();
        }
      });
    });
  },

  drawTitleForOneLine: function(ctx, content, height) {
    ctx.setFontSize(19);
    ctx.setFillStyle('#222222');
    // ctx.setTextBaseline('top'); // 1.4.0之后支持
    ctx.fillText(content, this.data.offset, height);
  },

  drawTitle: function(ctx) {
    const { lineHeight, bannerHeight, titleObj } = this.data;
    let height = bannerHeight + lineHeight + 5;
    for (let item of titleObj.list) {
      if (item !== 'a') {
        this.drawTitleForOneLine(ctx, item, height);
        height += lineHeight;
      }
    }
  },

  drawDescForOneLine: function(ctx, content, height) {
    ctx.setFontSize(16);
    ctx.setFillStyle('#666666');
    // ctx.setTextBaseline('top'); // 1.4.0之后支持
    ctx.fillText(content, this.data.offset, height);
  },

  drawDescribe: function(ctx) {
    const { lineHeight, bannerHeight, titleObj, descObj } = this.data;
    let height = bannerHeight + titleObj.line * lineHeight + lineHeight * 2 + 5;
    for (let item of descObj.list) {
      if (item !== 'a') {
        this.drawDescForOneLine(ctx, item, height);
        height += lineHeight;
      }
    }
  },

  drawSourceTime: function(ctx) {
    const {
      offset,
      lineHeight,
      titleObj,
      bannerHeight,
      source,
      date
    } = this.data;
    let height = bannerHeight + titleObj.line * lineHeight + lineHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    ctx.fillText(source + ' ' + date, offset, height);
  },

  drawLine: function(ctx) {
    const { contentHeight, offset, windowWidth, ewmHeight } = this.data;
    let height = contentHeight - ewmHeight - 20;
    ctx.beginPath();
    ctx.moveTo(offset, height);
    ctx.lineTo(windowWidth - offset, height);
    ctx.setStrokeStyle('#f1f1f1');
    ctx.stroke();
    ctx.closePath();
  },

  drawEwm: function(ctx) {
    const { ewm, windowWidth, contentHeight, ewmWidth, ewmHeight } = this.data;
    ctx.drawImage(
      ewm,
      windowWidth - ewmWidth - 10,
      contentHeight - ewmHeight - 10,
      ewmWidth,
      ewmHeight
    );
  },

  drawUser: function(ctx) {
    // 头像
    const {
      avatar,
      offset,
      username,
      contentHeight,
      lineHeight,
      hot
    } = this.data;
    const avatarWidth = 25;
    ctx.drawImage(
      avatar,
      offset,
      contentHeight - 100,
      avatarWidth,
      avatarWidth
    );
    // 昵称
    ctx.setFontSize(12);
    ctx.setFillStyle('#333333');
    ctx.fillText(username, offset + avatarWidth + 5, contentHeight - 82); // 82是猜测的
    // 正在阅读这篇文章
    let usernameWidth = username.length * 10;
    if (ctx.measureText) {
      ctx.font = 'normal bold 14';
      usernameWidth = ctx.measureText(username).width;
    }
    console.log('usernameWidth::', usernameWidth);
    ctx.setFontSize(12);
    ctx.setFillStyle('#666666');
    ctx.fillText(
      '正在阅读这篇文章',
      offset + avatarWidth + 5 + usernameWidth + 15,
      contentHeight - 82 // 82是猜测的
    );
    // 长按扫码
    ctx.setFontSize(15);
    ctx.setFillStyle('#444444');
    ctx.fillText('长按扫码', offset, contentHeight - 50);
    // hot
    ctx.drawImage(hot, offset + 66, contentHeight - 62, 22.5, 15);

    // 进入东方头条阅读全文
    ctx.setFontSize(14);
    ctx.setFillStyle('#666666');
    ctx.fillText('进入', offset, contentHeight - 20);
    ctx.setFontSize(14);
    ctx.setFillStyle('#f34c56');
    ctx.fillText('东方头条', offset + 30, contentHeight - 20);
    ctx.setFontSize(14);
    ctx.setFillStyle('#666666');
    ctx.fillText('阅读全文', offset + 90, contentHeight - 20);
  },

  savePic: function() {
    const { windowWidth, contentHeight } = this.data;
    wx.canvasToTempFilePath({
      x: 0,
      y: 50,
      width: windowWidth,
      height: contentHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        util.savePicToAlbum(res.tempFilePath);
      }
    });
  }
});
