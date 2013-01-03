
var FS=require("fs");
var PATH=require("path");
var FH=require('../file/fileHandle');

function compressor(config){
	var baseDir=config.baseDir;
	var targetDir=PATH.resolve(baseDir,config.targetDir);
	if(!FS.existsSync(targetDir));
		FH.mkdirpSync(targetDir);
	readDir(baseDir,targetDir);
}

function readDir(baseDir,targetDir){
	FS.readdir(baseDir,function(err,files){
		var file,i=0;
		while(file=files[i]){
			
			var base=PATH.join(baseDir,file);
			var target=PATH.join(targetDir,file);
			var stats=FS.lstatSync(base);
			if(stats.isDirectory() && base.indexOf(".svn") == -1){
				if(!FS.existsSync(target))
					FS.mkdirSync(target);
				readDir(base,target);
			}
			else if(stats.isFile()){
				var extension = PATH.extname(file).substr(1);
				if (extension == "js" || extension == "css")
					require('./compressor').yuicompressor(base, target, extension);
			}
			i++;
		}
	})
}

exports.compressor=compressor;