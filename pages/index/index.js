import util from '../../utils/util';

const app = getApp();
const ewmRealWidth = 292;
const ewmRealHeight = 317;

Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
    contentHeight: 0,
    thinkList: [],
    footer: '',
    offset: 0,
    bannerHeight: 0,
    lineHeight: 30,
    ewmWidth: 100,
    ewmHeight: (100 * ewmRealHeight) / ewmRealWidth,
    image:
      'https://07.imgmini.eastday.com/mobile/20180605/20180605105656_d91864008f19d7d6d3340d13a9f55b4e_2.jpeg',
    content: '他们都是著名歌手，一个靠唱歌成亿万富豪，一个靠娶了2个老婆'
  },

  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log('res::', res);
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          offset: 15, // (res.windowWidth - 300) / 2,
          bannerHeight: (res.windowWidth * 9) / 16
        });
      }
    });
  },

  onShow: function() {
    this.getData();
  },

  getData: function() {
    let that = this;

    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let thinkList = [];
    for (let item of that.data.content) {
      if (item === '\n') {
        thinkList.push(thinkStr);
        thinkList.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 18) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    // console.log('thinkList::', thinkList);
    that.setData({ thinkList: thinkList });
    that.createNewImg(lineNum);
  },

  drawSquare: function(ctx, height) {
    ctx.rect(0, 50, this.data.windowWidth, height);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
  },

  drawFont: function(ctx, content, height) {
    ctx.setFontSize(19);
    ctx.setFillStyle('#222222');
    // console.log('this.data.bannerHeight::', this.data.bannerHeight);
    ctx.fillText(content, this.data.offset, height);
  },

  drawLine: function(ctx, height) {
    ctx.beginPath();
    ctx.moveTo(this.data.offset, height);
    ctx.lineTo(this.data.windowWidth - this.data.offset, height);
    ctx.stroke('#eee');
    ctx.closePath();
  },

  drawImg: function(ctx, image) {
    ctx.drawImage(image, 0, 0, this.data.windowWidth, this.data.bannerHeight);
  },

  createNewImg: function(lineNum) {
    let that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    let contentHeight =
      lineNum * that.data.lineHeight + 180 + this.data.bannerHeight;
    that.drawSquare(ctx, contentHeight);
    that.setData({ contentHeight: contentHeight });
    let height = 30 + this.data.bannerHeight;
    for (let item of that.data.thinkList) {
      if (item !== 'a') {
        that.drawFont(ctx, item, height);
        height += that.data.lineHeight;
      }
    }
    that.drawImg(ctx, this.data.image);
    that.drawLine(ctx, lineNum * that.data.lineHeight + 120);
    that.drawFont(ctx, that.data.footer, lineNum * that.data.lineHeight + 156);
    ctx.drawImage(
      '../../image/ewm.png',
      that.data.windowWidth - this.data.ewmWidth,
      this.data.contentHeight - this.data.ewmHeight,
      this.data.ewmWidth,
      this.data.ewmHeight
    );
    ctx.draw();
  },

  savePic: function() {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 50,
      width: that.data.windowWidth,
      height: that.data.contentHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        util.savePicToAlbum(res.tempFilePath);
      }
    });
  }
});
