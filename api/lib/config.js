/*
	Config global library 

	Application Library
	Created By: Parth Gandhi
*/

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
	self.errors = {};
	self.responseObject={};
	self.errors['INVALIDSIZE'] = {error: true, message: "The Size attribute is invalid"};
	self.errors['INVALIDFIELDNAME'] = {error: true, message: "The field name is invalid"};
	self.errors['ISEMPTY'] = {error: true, message: "This file is empty"};
	self.errors['ISNOTFILE'] = {error: true, message: "The specified path is not a file"};
	self.errors['ISNOTJSON'] = {error: true, message: "The file is not valid JSON"};
	self.errors['CODENOTFOUND'] = {error: true, message: "Error code does not exist"};
	self.errors['FILENOTFOUND'] = {error: true, message: "The specified file does not exist"};
	self.errors['INVALIDFILETYPE'] = {error: true, message: "The file type attribute is invalid"};
	self.errors['INVALIDSTOREMODE'] = {error: true, message: "The store mode attribute is invalid"};
	self.errors['INVALIDDELETEAFTERTRANSFER'] = {error: true, message: "The delete after transfer attribute is invalid"};
	self.errors['INVALIDRENAMESCHEMA'] = {error: true, message: "The rename_schema attribute is invalid"};
	self.errors['INVALIDRENAMEPREFIX'] = {error: true, message: "The rename_prefix attribute is invalid"};
	self.errors['INVALIDOVERWRITE'] = {error: true, message: "The overwrite attribute is invalid"};

	self.responseObject['VALIDSIZE'] = {error: false, message: "The Size attribute is valid"};
	self.responseObject['VALIDFIELDNAME'] = {error: false, message: "The field name is valid"};
	self.responseObject['FILEEXISTS'] = {error: false, message: "The specified path is a file"};
	self.responseObject['VALIDJSON'] = {error: false, message: "The file is a valid JSON"};
	self.responseObject['CODENOTFOUND'] = {error: false, message: "code does not exist"};
	self.responseObject['VALIDFILE'] = {error: false, message: "The specified file is valid"};
	self.responseObject['VALIDFILETYPE'] = {error: false, message: "The file type attribute is valid"};
	self.responseObject['VALIDSTOREMODE'] = {error: false, message: "The store mode attribute is valid"};
	self.responseObject['VALIDDELETEAFTERTRANSFER'] = {error: false, message: "The delete after transfer attribute is valid"};
	self.responseObject['VALIDRENAMESCHEMA'] = {error: false, message: "The rename_schema attribute is valid"};
	self.responseObject['VALIDRENAMEPREFIX'] = {error: false, message: "The rename_prefix attribute is valid"};
	self.responseObject['VALIDOVERWRITE'] = {error: false, message: "The overwrite attribute is valid"};

}
//global error object for any request
Config.prototype.returnErrorObj = function(code) {
	var self=this;

	var returnObj;
	if(self.errors[code]==undefined){
		returnObj = self.errors["CODENOTFOUND"];
	}

	returnObj = self.errors[code]

	returnObj.code = code;
	return returnObj;
}
//global return object for any request
Config.prototype.returnObj = function(code) {
	var self=this;
	var returnObj;
	if(self.responseObject[code]==undefined){
		returnObj = self.responseObject["CODENOTFOUND"];
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
