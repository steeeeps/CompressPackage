/**
 * 默认压缩方式，将源文件重命名为uncompressed.js
 * 以原文件名生成压缩后的文件
 * @author Administrator
 *
 */
var FS = require('fs');
var PATH = require("path");

function compressor(config) {
    readDir(config.baseDir);
}

/**
 * 遍历目录
 * @param {String} dir
 */
function readDir(dir) {
    FS.readdir(dir, function(err, files) {
        var i = 0, state;
        var file;
        while ( file = files[i]) {
            var f = PATH.join(dir, file);
            var stats = FS.lstatSync(f);
            if (stats.isDirectory() && f.indexOf(".svn") == -1) {
                readDir(f);
            } else if (stats.isFile()) {
                renameFile(f);
            }
            i++;
        };

    });

}

/**
 * 对源文件重命名
 * @method
 * @param {Object} file
 */
function renameFile(file) {
    //去掉'.'操作符
    var extension = PATH.extname(file).substr(1);
    if (extension != "js" && extension != "css")
        return;
    var targetfile = file + ".uncompressed." + extension
    FS.rename(file, targetfile, function() {
        require('./compressor').yuicompressor(targetfile, file, extension);
    });
}

exports.compressor = compressor;
