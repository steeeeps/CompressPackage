/**
 * @author Administrator
 */
var C2N = require("./compressorToNewDir");
var DC = require('./defaultCompressor');
var FS = require('fs');
var YC = require('yuicompressor');

/**
 * 根据配置信息选择压缩文件
 * @mathod compressor
 * @param {Object} configData 配置信息
 */
function compressor(configData) {
    configData.targetDir ? C2N.compressor(configData) : DC.compressor(configData);
}

function yuicompressor(originFile, targetFile, type) {

    YC.compress(originFile, {
        //Compressor Options:
        charset : 'utf8',
        type : type,
        //是否混淆变量
        //nomunge : true,
        //是否换行
        'line-break' : 8000
    }, function(err, data, extra) {
        //err   If compressor encounters an error, it's stderr will be here
        //data  The compressed string, you write it out where you want it
        //extra The stderr (warnings are printed here in case you want to echo them
        if (err)
            throw err;
        FS.writeFile(targetFile, data, function(err) {
            if (err)
                throw err;
            console.log("file compressed to: "+targetFile)
        });
    });
}


exports.compressor = compressor;
exports.yuicompressor = yuicompressor;
