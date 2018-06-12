const offset = 15;
const lineHeight = 26;
const ewmWidth = 100;
const ewmHeight = 100;
const hot = '../image/hot.png';
const playicon = '../image/play.png';

let windowWidth = 0;
let windowHeight = 0;
let contentHeight = 0;
let bannerHeight = 0;
let titleObj = {};

let options = {
  ctx: {}, // canvas对象
  avatar: '../image/avatar.png',
  nickName: '你的好友',
  banner:
    'https://07.imgmini.eastday.com/mobile/20180329/4b55ac6f0e23e2a295ea48d93d79cfdc.jpeg',
  title: '东方头条新闻',
  ewm: '../image/ewm.jpg'
};

function createImg(customOptions) {
  return new Promise(resolve => {
    options = {
      ...options,
      ...customOptions
    };
    init().then(() => {
      console.log('contentHeight::', contentHeight);
      let ctx = options.ctx;
      drawSquare(ctx);
      drawTitle(ctx);
      drawEwm(ctx);
      drawLine(ctx);
      drawUser(ctx);
      drawFooter(ctx);
      getImgPath(options.banner)
        .then(path => {
          console.log(path);
          drawBanner(ctx, path);
          ctx.draw();
          resolve({ contentHeight });
          // 为了保证playicon在banner上方，做了一个延时处理。
          setTimeout(() => {
            drawPlayIcon(ctx);
            ctx.draw(true);
          }, 200);
        })
        .catch(() => {
          ctx.draw();
          resolve({ contentHeight });
        });
    });
  });
}

function init() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: function(res) {
        // console.log('res::', res);
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
        bannerHeight = (windowWidth * 9) / 16;

        let lineCount = 18;
        // 标题一行字数计算
        if (windowWidth < 375) {
          lineCount = 16;
        } else if (windowWidth < 414) {
          lineCount = 18;
        } else {
          lineCount = 21;
        }

        const { title, describe } = options;
        titleObj = optionStr(title, lineCount);
        contentHeight =
          bannerHeight +
          titleObj.line * lineHeight +
          ewmHeight +
          lineHeight * 2;

        resolve();
      }
    });
  });
}

/**
 * 将指定字符串按照一行显示指定字数切割成一个数组，并计算出行数（默认一行18个字）
 */
function optionStr(str, lineNum = 18) {
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
  // console.log(line, list);
  return {
    line: line,
    list: list
  };
}

function drawSquare(ctx) {
  ctx.rect(0, 0, windowWidth, contentHeight);
  ctx.setFillStyle('#ffffff');
  ctx.fill();
}

function getImgPath(img) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: img,
      success: function(res) {
        // console.log(res.path);
        resolve(res.path);
      }
    });
  });
}

function drawBanner(ctx, path) {
  ctx.drawImage(path, 0, 0, windowWidth, bannerHeight);
}

function drawPlayIcon(ctx) {
  const iconWidth = 40;
  const iconHeight = 40;
  ctx.drawImage(
    playicon,
    windowWidth / 2 - iconWidth / 2,
    bannerHeight / 2 - iconHeight / 2,
    iconWidth,
    iconHeight
  );
}

function drawTitleForOneLine(ctx, content, height) {
  ctx.setFontSize(19);
  ctx.setFillStyle('#222222');
  // ctx.setTextBaseline('top'); // 1.4.0之后支持
  ctx.fillText(content, offset, height);
}

function drawTitle(ctx) {
  let height = bannerHeight + lineHeight + 5;
  for (let item of titleObj.list) {
    if (item !== 'a') {
      drawTitleForOneLine(ctx, item, height);
      height += lineHeight;
    }
  }
}

function drawLine(ctx) {
  let height = contentHeight - ewmHeight - 20;
  ctx.beginPath();
  ctx.moveTo(offset, height);
  ctx.lineTo(windowWidth - offset, height);
  ctx.setStrokeStyle('#f1f1f1');
  ctx.stroke();
  ctx.closePath();
}

function drawEwm(ctx) {
  const { ewm } = options;
  ctx.drawImage(
    ewm,
    windowWidth - ewmWidth - 10,
    contentHeight - ewmHeight - 10,
    ewmWidth,
    ewmHeight
  );
}

function drawUser(ctx) {
  // 头像
  const { avatar, nickName } = options;
  const avatarWidth = 25;
  ctx.drawImage(avatar, offset, contentHeight - 100, avatarWidth, avatarWidth);
  // 昵称
  ctx.setFontSize(12);
  ctx.setFillStyle('#333333');
  ctx.fillText(nickName, offset + avatarWidth + 5, contentHeight - 82); // 82是猜测的
  // 正在阅读这篇文章
  let nickNameWidth = nickName.length * 8;
  if (ctx.measureText) {
    ctx.font = 'normal bold 14';
    nickNameWidth = ctx.measureText(nickName).width;
  }
  console.log('nickNameWidth::', nickNameWidth);
  ctx.setFontSize(12);
  ctx.setFillStyle('#666666');
  ctx.fillText(
    '正在阅读这篇文章',
    offset + avatarWidth + 5 + nickNameWidth + 10,
    contentHeight - 82 // 82是猜测的
  );
}

function drawFooter(ctx) {
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
}

module.exports = {
  createImg
};
