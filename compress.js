var FH = require("./file/fileHandle");
var COMP = require("./compressor/compressor")


var config = FH.getConfigData('config.json');
COMP.compressor(config);
