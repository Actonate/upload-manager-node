var fs = require('fs');
var bunyan = require('bunyan');
var config = require('../lib/config.js')
var log = bunyan.createLogger({
    name: "UploadsController",
    // streams: [
 //    {
 //        level:"info",
 //        path:"/home/titangit/titan-server-rest/logs/infologs.js",    
 //    }
    //]
});
function UploadsController(){
    var self = this;
    self.filePath=config.getJSONFilePath();
}
UploadsController.prototype.readJSONFromFile=function(filepath,callback) {
    var self=this;
    var filePath=filepath;
    //check if file exists
    fs.exists(filePath, function(exists){
        //File does not exists
        if(!exists){
            var errResponse=config.returnErrorObj("FILENOTFOUND")
            callback(true, errResponse);
            return;
        }
        //File exists
        else{
            var response=config.returnObj("FILEEXISTS")
            callback(false,response);
            return;
        }
    });
}
UploadsController.prototype.checkJSONSanity=function(filepath,callback) {
    var self=this;
    var filePath=filepath;
    //Read File from file path
    fs.readFile(filePath, {encoding: 'utf-8'},function(err,data){
        if(err){
                var errResponse=config.returnErrorObj("ISNOTJSON")
                callback(true, errResponse);
                return;
        }
        //Check if file is empty
        if(data!=" "|| data!=null){
            try{
                //Parse if JSON is valid
                JSON.parse(data);
                var response=config.returnObj("VALIDJSON")
                callback(false,response)
            }        
            //If JSON is not valid
            catch(e){
                var errResponse=config.returnErrorObj("ISNOTJSON")
                callback(true, errResponse);
                return;
            }
            return;
        }
        //if file is empty
        else{
          var errResponse=config.returnErrorObj("ISEMPTY")
          callback(true, errResponse);
          return;
        }
    })
}
UploadsController.prototype.checkFieldNameAttribute=function(data,callback) {
    //Check if field name is not empty
    if(data!=null){
        /* DataType of field name should be string and should contain 
           only alphabets and/or _ and/or -.
        */ 
        if(typeof data==='string' && /^[a-zA-Z_-]+$/.test(data)){
            var response=config.returnObj("VALIDFIELDNAME")
            callback(false, response);
            return;
        }
        //Invalid Data
        else{
            var errResponse=config.returnErrorObj("INVALIDFIELDNAME")
            callback(true, errResponse);
            return;
        }
    }
    //If field name is empty
    else{
        var errResponse=config.returnErrorObj("INVALIDFIELDNAME")
        callback(true, errResponse);
        return;
    }
}
UploadsController.prototype.checkSizeAttribute=function(data,callback) {
    //Check if size is not empty
    if(data!=null){
        //DataType of field name should be String
        if(typeof data==='number'){
            var response=config.returnObj("VALIDSIZE")
            callback(false, response);
            return;
        }
        try{
           var size = JSON.parse(data)
           if((typeof size.minSize==='number' && typeof size.maxSize==='number') || 
              (typeof size.minSize==='number' && size.maxSize==null) ||
              (size.minSize==null && typeof size.maxSize==='number')){
                var response=config.returnObj("VALIDSIZE")
                callback(false, response);
                return;
           }
           else{
                var errResponse=config.returnErrorObj("INVALIDSIZE")
                callback(true, errResponse);
                return;               
           }
        }
        catch(e)
        {
            var errResponse=config.returnErrorObj("INVALIDSIZE")
            callback(true, errResponse);
            return;            
        }
    }
    //If Size is empty
    else{
        var response=config.returnObj("VALIDSIZE")
        callback(false, response);
        return;
    }
}
UploadsController.prototype.checkFileTypeAttribute=function(data,callback) {
    //Check if file type is not empty
    if(data!=null){
        // DataType of file type should be string  
        if(typeof data==='string'){
            var response=config.returnObj("VALIDFILETYPE")
            callback(false, response);
            return;
        }
        //Invalid Data
        else{
            var errResponse=config.returnErrorObj("INVALIDFILETYPE")
            callback(true, errResponse);
            return;
        }
    }
    //If file type is empty
    else{
        var response=config.returnObj("VALIDFILETYPE")
        callback(false, response);
        return;
    }
}
UploadsController.prototype.checkStoreModeAttribute=function(data,callback) {
    //Check if store mode is not empty
    if(data!=null){
        // DataType of store mode should be string and data should be directory,REST,database 
        if(typeof data==='string' && 
          (data=="directory" || data=="REST" || data=="database")){
            var response=config.returnObj("VALIDSTOREMODE")
            callback(false, response);
            return;
        }
        //Invalid Data
        else{
            var errResponse=config.returnErrorObj("INVALIDSTOREMODE")
            callback(true, errResponse);
            return;
        }
    }
    //If store mode is empty
    else{
        var errResponse=config.returnErrorObj("INVALIDSTOREMODE")
        callback(true, errResponse);
        return;
    }
}
UploadsController.prototype.checkDeleteAfterTransferAttribute=function(data,callback) {

}
UploadsController.prototype.checkRenameSchemaAttribute=function(data,callback) {

}
UploadsController.prototype.checkRenamePrefixAttribute=function(data,callback) {

}
UploadsController.prototype.checkOverwriteAttribute=function(data,callback) {

}

// UploadsController.prototype.uploadfile = function(req, res) {
// 	var self = this;
//     var currentTimeMilliseconds = (new Date()).getTime();
//     var originalFileName = req.body.files;
//     req.file('avatar').upload(function (err, files) {
//         if (err){
//             return res.serverError(err);
//         }
//         console.log(files);
//         for(var i=0;i<files.length;i++){
//             var currentTimeMilliseconds=(new Date()).getTime();
//             var tempLocation = files[i].fd;
//             var originalFileName=files[i].filename;
//             var fileNameWithoutExt=originalFileName.split(".");
//             var ext=fileNameWithoutExt[fileNameWithoutExt.length-1];
//             fileNameWithoutExt = fileNameWithoutExt.splice(ext,1);
//             var filen=fileNameWithoutExt.join(".");
//             var mainfile= currentTimeMilliseconds+"."+ext;
//             var targetLocation = "/home/parth/titangit/samples/uploads/"+mainfile;
//             console.log(targetLocation);
//             var source = fs.createReadStream(tempLocation);
//             var dest = fs.createWriteStream(targetLocation);
//             source.pipe(dest);
//             source.on('end', function() { 
//                  /* copied */
//                 log.info("uploaded to main")
//                 // res.send({error: false, object: {filename: mainfile}});
//             });
//             source.on('error', function(err) {
//                /*error */
//                 log.error(err);
//                // res.send({error: true, object: {filename: mainfile}});
//             });     
//         }
//         return res.json({
//         message: files.length + ' file(s) uploaded successfully!',
//         files: files
//       });
//     });
// }
module.exports = new UploadsController();