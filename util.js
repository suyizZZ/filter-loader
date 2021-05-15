const jpeg = require('jpeg-js');

module.exports.isJpg = (buffer) => {
  if (!buffer || buffer.length < 3) {
    return false;
  }
  return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
};

module.exports.getRGBA8Array = function ({ data, width, height }) {
  const rgbArr = [];
  for (let i = 0; i < width * height * 4; i += 4) {
    rgbArr[1 + 0] = data[i + 0];
    rgbArr[1 + 1] = data[i + 1];
    rgbArr[1 + 2] = data[i + 2];
    rgbArr[1 + 3] = data[i + 3];
  }
  return {
    data: rgbArr,
    width,
    height,
  };
};

module.exports.RGBAToBuffer = function ({ data, width, height }) {
  const frameData = Buffer.alloc(width * height * 4);
  var i = 0;
  while (i < frameData.length) {
    frameData[i] = data[i];
    frameData[i + 1] = data[i + 1];
    frameData[i + 2] = data[i + 2];
    frameData[i + 3] = data[i + 3];
    i += 4;
  }
  var rawImageData = {
    data: frameData,
    width: width,
    height: height,
  };
  var jpegImageData = jpeg.encode(rawImageData, 50);
  return jpegImageData.data;
};
// 漫画
module.exports.cartoon = function (imgData) {
  for (var i = 0; i < imgData.height * imgData.width * 4; i += 4) {
    const data = imgData.data;
    var r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    var newR = (Math.abs(g - b + g + r) * r) / 256;
    var newG = (Math.abs(b - g + b + r) * r) / 256;
    var newB = (Math.abs(b - g + b + r) * g) / 256;
    var rgbArr = [newR, newG, newB];
    [data[i], data[i + 1], data[i + 2]] = rgbArr;
  }
  return imgData;
};

// 灰度
module.exports.grayscale = function (imgData) {
  for (var i = 0; i < imgData.height * imgData.width * 4; i += 4) {
    const data = imgData.data;
    const grey = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = Math.round(grey);
  }
  return imgData;
};
