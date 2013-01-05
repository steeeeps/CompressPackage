/**
 * package js or css files sync
 */
var PATH=require('path');
var FS=require('fs');

var baseDir="";
var dataCache={};

function package(config){

	baseDir=config.baseDir;
	var layers=config.layers;

	for(var i=0,len=layers.length;i<len;i++){
		var layer=layers[i];
		writeLayerFile(layer);

	}
}

function writeLayerFile(layer){
	var layerName=layer.name,
		alldata=parseDepends(layer.depends),
		targetFile=PATH.resolve(baseDir,layerName),
   		extension = PATH.extname(layerName).substr(1);
   		
    if(layer.compress)
    	require('../compressor/compressor').yuicompressor(alldata, targetFile, extension);
    else
   	 	writeFile(targetFile,alldata);
}

function parseDepends(depends){

	var data="";
	for (var i = 0; i<depends.length; i++) {
		var d=depends[i];
		data+=parseDepends(d.depends);
		data+=getLayerData(d.name);
		
	};
	return data;
}

function getLayerData(name){
    var path=PATH.resolve(baseDir,name);
	var data=dataCache[path] || getDataFromPath(path);

	return data;
}

function getDataFromPath(path){

	if(!FS.existsSync(path)){
		throw "no such file :  "+path;
	}

	 var data=FS.readFileSync(path,"utf-8")
	 dataCache[path]=data;
	 console.log("get data from : "+path +"  OK")
	 return data;
}


function writeFile(path,data){
    FS.writeFile(path,data,"utf-8",function(err){
        if(err)
            throw err;
        console.log("write file to:  "+path);
    });
}

exports.package=package;