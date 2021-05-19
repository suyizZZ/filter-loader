'use strict';
const loaderUtils = require('loader-utils');
const PNGReader = require('@syfwl/png.js');
const jpeg = require('jpeg-js');
const { isJpg, methods, RGBAToBuffer } = require('./util');
// const ndarray = require('ndarray');

module.exports = function (content, map, meta) {
  var options = Object.assign({}, loaderUtils.getOptions(this));
  console.log(options, 'options');
  const { filter } = options;

  if (!filter){
		throw new Error('Error options requires filter type');
	}

  const isJpgType = isJpg(content); // 是否为jpg  目前 支持jpg  png 两种格式
  const callback = this.async();

  const method = methods[filter] || methods.default;

  if (isJpgType) {
    var rawImageData = jpeg.decode(content, { useTArray: true });
    const width = rawImageData.width;
    const height = rawImageData.height;

    const imageData = {
      data: rawImageData.data,
      width,
      height,
    };
    const transformImageData = method(imageData);
    const buffer = RGBAToBuffer(transformImageData);
    callback(null, buffer);
  } else {
    var reader = new PNGReader(content);
    reader.parse(function (err, png) {
      if (err) throw err;

      const rgbaArr = png.getRGBA8Array();
      const width = png.getWidth();
      const height = png.getHeight();
      const imageData = {
        data: rgbaArr,
        width,
        height,
      };
      const transformImageData = method(imageData);
      const buffer = RGBAToBuffer(transformImageData);
      callback(null, buffer);
    });
  }
};

module.exports.raw = true;
