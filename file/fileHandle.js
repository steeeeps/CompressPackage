var FS = require('fs');
var PATH = require('path');

var configObj = {};

function getConfigData(configFileName) {
    var data= FS.readFileSync(configFileName, "utf-8");
    configObj = JSON.parse(data);
    console.log(configObj.baseDir);
    if (!configObj) {
        throw "请输入压缩打包配置文件路径!";
    }
    return configObj;
}



/* mkdir -p for absolute path in node  */
/*thanks for https://gist.github.com/2817910*/

function mkdirpSync (pathes, mode) {
    mode = mode || 0777;
    var sep=PATH.sep;
    var dirs = pathes.trim().split(sep);
    // /home
    if (!dirs[0]) {
       
        dirs.shift();
    }
    
    dirs.length && mkdir(sep==="/"? sep + dirs.shift() : dirs.shift());
    // mkdir
    function mkdir (d) {
        if (!FS.existsSync(d)) {
            FS.mkdirSync(d, mode);
        }
 
        dirs.length && mkdir(d + sep+ dirs.shift());
    }
}
 
// eg
//mkdirpSync('/hoem/me');

exports.getConfigData = getConfigData;
exports.mkdirpSync = mkdirpSync;

