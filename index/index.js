import util from '../utils/util';
const MyCanvas = require('../canvas/index.js');

Page({
  data: {
    contentHeight: 0
  },

  onLoad: function(options) {},

  gotUserInfo: function(e) {
    this.showToast();
    const userInfo = e.detail.userInfo;
    // console.log(e.detail);
    let customOptions = {
      ctx: wx.createCanvasContext('myCanvas'),
      avatar: userInfo ? userInfo.avatarUrl : '../image/avatar.png',
      nickName: userInfo ? userInfo.nickName : '你的好友',
      banner:
        'http://02.imgmini.eastday.com/mobile/20180602/20180602_e24b87efecc240fe3e9c46cdebee8f76_cover_mwpm_05501609.jpg',
      title: '36岁离婚后瘦骨如柴，无戏可拍比鲁豫还可怜，自理更生成这样！',
      source: '东方头条',
      date: '2018-06-03 12:29',
      describe:
        '此图片来源于网络张韶涵曾与她的妈妈因为钱的事情闹得不可开交，也被大众都知道，随后张韶涵的事业一直没有...',
      ewm: '../image/ewm.jpg'
    };
    MyCanvas.ImgNews.createImg(customOptions).then(res => {
      this.setData({
        contentHeight: res.contentHeight
      });
      this.hideToast();
    });

    // MyCanvas.VideoNews.createImg(customOptions).then(res => {
    //   this.setData({
    //     contentHeight: res.contentHeight
    //   });
    //   this.hideToast();
    // });

    // MyCanvas.TxtNews.createImg(customOptions).then(res => {
    //   this.setData({
    //     contentHeight: res.contentHeight
    //   });
    //   this.hideToast();
    // });
  },

  showToast: function() {
    wx.showToast({
      title: '正在生成海报',
      icon: 'loading',
      duration: 3000,
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },
  hideToast: function() {
    wx.hideToast();
  },

  savePic: function() {
    const { contentHeight } = this.data;
    wx.getSystemInfo({
      success(res) {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: res.windowWidth,
          height: contentHeight,
          canvasId: 'myCanvas',
          success: function(res) {
            util.savePicToAlbum(res.tempFilePath);
          }
        });
      }
    });
  }
});
