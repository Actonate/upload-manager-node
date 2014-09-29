/*
	Config global library 

	Application Library
	Created By: Parth Gandhi
*/
var fs=require('fs');

function Config(){
	var self = this;
	//status field msgs of the global return object
	self.status={
		retrieved:{msg:"Data has been Retrieved"},
		validationfailed:{msg:"Validation has been Failed"},
		saved:{msg:"Data has been Saved"},
		updated:{msg:"Data has been Updated"},
		exists:{msg:"Already exists"},
		error:{msg:"Error"},
		deleted:{msg:"Deleted"}
	};

	self.filePath = "/home/parth/upload-manager-node/upload-manager-node/spec/upload_profiles/";
	self.jsonFilePath = "/home/parth/upload-manager-node/upload-manager-node/api/lib/json/error.json";
	self.responseObject = {
							"VALIDSIZE" : {"error": false, "message": "The Size attribute is valid"},
							"VALIDFIELDNAME" : {"error": false, "message": "The field name is valid"},
							"FILEEXISTS" : {"error": false, "message": "The specified path is a file"},
							"VALIDJSON" : {"error": false, "message": "The file is a valid JSON"},
							"CODENOTFOUND" : {"error": false, "message": "code does not exist"},
							"VALIDFILE" : {"error": false, "message": "The specified file is valid"},
							"VALIDFILETYPE" : {"error": false, "message": "The file type attribute is valid"},
							"VALIDSTOREMODE" : {"error": false, "message": "The store mode attribute is valid"},
							"VALIDDELETEAFTERTRANSFER" : {"error": false, "message": "The delete after transfer attribute is valid"},
							"VALIDRENAMESCHEMA" : {"error": false, "message": "The rename_schema attribute is valid"},
							"VALIDRENAMEPREFIX" : {"error": false, "message": "The rename_prefix attribute is valid"},
							"VALIDOVERWRITE" : {"error": false, "message": "The overwrite attribute is valid"},
							"VALIDEXTENSION" : {"error": false, "message": "The extension attribute is valid"},
		          		  },
				self.errors={
							 "INVALIDSIZE" : {"error": true, "message": "The Size attribute is invalid"},
							 "INVALIDFIELDNAME" : {"error": true, "message": "The field name is invalid"},
							 "ISEMPTY" : {"error": true, "message": "This file is empty"},
							 "ISNOTFILE" : {"error": true, "message": "The specified path is not a file"},
							 "ISNOTJSON" : {"error": true, "message": "The file is not valid JSON"},
							 "CODENOTFOUND" : {"error": true, "message": "Error code does not exist"},
							 "FILENOTFOUND" : {"error": true, "message": "The specified file does not exist"},
							 "INVALIDFILETYPE" : {"error": true, "message": "The file type attribute is invalid"},
							 "INVALIDSTOREMODE" : {"error": true, "message": "The store mode attribute is invalid"},
							 "INVALIDDELETEAFTERTRANSFER" : {"error": true, "message": "The delete after transfer attribute is invalid"},
							 "INVALIDRENAMESCHEMA" : {"error": true, "message": "The rename_schema attribute is invalid"},
							 "INVALIDRENAMEPREFIX" : {"error": true, "message": "The rename_prefix attribute is invalid"},
							 "INVALIDOVERWRITE" : {"error": true, "message": "The overwrite attribute is invalid"},
							 "INVALIDEXTENSION" : {"error": true, "message": "The extension attribute is invalid"},
							}
}
//global error object for any request
Config.prototype.returnErrorObj = function(code) {
	var self=this;
	var returnObj;
	// console.log(code);
	// console.log(self.jsonFilePath);
 //    fs.readFile(self.jsonFilePath,function(err,data){
	// 	if(err){
	//         var errResponse=config.returnErrorObj("ISNOTJSON")
	//         console.log(err);
	//         return;
	// 	}
		// console.log(data)
		// self.errors=data;
		if(self.errors[code]==undefined){
			var notFound="CODENOTFOUND";
			returnObj = self.errors[notFound];
			returnObj.code = code;
			return returnObj;
		}
		returnObj = self.errors[code]
		returnObj.code = code;
		return returnObj;
	// })
}
//global return object for any request
Config.prototype.returnObj = function(code) {
	var self=this;
	var returnObj;
	if(self.responseObject[code]==undefined){
		var notFound="CODENOTFOUND";
		returnObj = self.responseObject[notFound];
	}
	returnObj = self.responseObject[code]
	returnObj.code = code;
	return returnObj;
}
//File path for upload profiles
Config.prototype.getJSONFilePath=function() {
	var self=this;
	return self.filePath;
}

module.exports = new Config();
