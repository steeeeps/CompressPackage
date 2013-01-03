var FH = require("./file/fileHandle");
var P=require("./package/package");

var config = FH.getConfigData("config.json");

P.package(config);