var PATH=require('path');
var FS=require('fs');
var ASYNC=require('async');
var HTTP=require('http');

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
	var depNames="",
		layerName=layer.name,
		alldata=[];

		depNames=parseDepends(layer.depends);
		depNames=depNames.substr(1).split(',');

		ASYNC.until(
		    function () {
		    	return alldata.length===depNames.length ; 
		    },
		    function (callback) {
		       	alldata=getAllDatasByDependNames(depNames);
		        setTimeout(callback, 1000);
		    },
		    function (err) {

		        if(err)
		        	throw err;
		        var d=alldata.join(""),
		        	p=PATH.resolve(baseDir,layerName),
		       		extension = PATH.extname(layerName).substr(1);
		        if(layer.compress)
		        	require('../compressor/compressor').yuicompressor(d, p, extension);
		        else
		       	 	writeFile(p,d);
		    }
		);
}

function parseDepends(depends){

	var depNames="";
	for (var i = 0; i<depends.length; i++) {
		var d=depends[i]
		depNames+=parseDepends(d.depends)+","+d.name;
		getLayerData(d.name);
		
	};
	return depNames;
}

function getLayerData(name){
	var data=dataCache[name];
	if(data){
		return ;
	}
		
	isUrl(name)?getDataFromUrl(name):getDataFromPath(name);
}
function getDataFromUrl(url){
	console.log("get data from url: "+url);
	var data="";
	HTTP.get(url,function(res){
		res.on('data',function(d){
			data+=d.toString();
		});
		res.on("end",function(d){
			// return data;
			console.log("get data from url: "+url+"  OK");
			dataCache[url]=data;
			console.log("cache data for url: "+url);
		});
	});

}
function getDataFromPath(name){
	var path=PATH.resolve(baseDir,name)
	console.log("get data from : "+path);

	if(!FS.existsSync(path)){
		throw "no such file :  "+path;
	}

	FS.readFile(path,"utf-8",function(err,data){
		if(err)
			throw err;
		console.log("get data from : "+path +"  OK");
		dataCache[name]=data;
		console.log("cache data for path: "+path);
	})
	 //dataCache[name]=FS.readFileSync(path,"utf-8");
}
function isUrl(str){
	return str.indexOf("http://")!==-1 || str.indexOf("https://")!==-1;
}

function getAllDatasByDependNames(names){
	var alldata=[];
	
	for(var i=0,len=names.length;i<len;i++){
		var n=names[i];
		var data=dataCache[n];
		console.log("get data from dataCache for path/url :  "+n);
		if(data)
			alldata.push(data);
	}
	return alldata;
}
function writeFile(path,data){
    FS.writeFile(path,data,"utf-8",function(err){
        if(err)
            throw err;
        console.log("write file to:  "+path);
    });
}

exports.package=package;