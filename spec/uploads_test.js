/* Test Cases for Auth Controller */

/* the request module (npm install request) */
var fs=require('fs');
var request = require('request');
//The global application url
var appUrl = "http://localhost:1337";
var bunyan = require('bunyan');
var upload = require('../api/controllers/uploadcontroller.js')
var log = bunyan.createLogger({
  name: "UploadTest",
});
var config = require('../api/lib/config.js')

describe("Testing Uploads Controller", function() {
  //check if the file exists or not
  xdescribe("readJSONFromFile",function(){
    it("File does not exists", function(done) {
      upload.readJSONFromFile(config.filePath+'xyz.json',function(err,response){
        expect(response.code).toEqual("FILENOTFOUND");
        done();
      });
    });
   /*   Test case if file is valid
    * 
    *   Expected Input: filename
    *   Expected Output: true
    */
    it("File exists", function(done) {
      fs.writeFile(config.filePath+'abc.json',"ds",function(err){
        upload.readJSONFromFile(config.filePath+'abc.json',function(err,response){
          expect(response.code).toEqual("FILEEXISTS");
          fs.unlink(config.filePath+'abc.json',function(err){
            done();
          });
        });
      //TODO add wait timeout
      });
    });
  });
  //check if the file is a valid json or not
  xdescribe("checkJSONSanity",function(){
     /*   Test case if file is valid JSON file
      * 
      *   Expected Input: filename
      *   Expected Output: true
      */
    it("Valid JSON file", function(done) {
      fs.writeFile(config.filePath+'documents.json', '{"field name": "documents"}', function(err) {
          if(err) {
            console.log(err);
          } 
          else {
            upload.checkJSONSanity(config.filePath+'documents.json',function(err,response){
              expect(response.code).toEqual("VALIDJSON");
              fs.unlink(config.filePath+'documents.json',function(err){
                done();
              });
            });
          }
      //TODO add wait timeout
      });
    });
   /*   Test case if file is invalid JSON file
    * 
    *   Expected Input: filename
    *   Expected Output: Error code ISNOTJSON
    */
    it("Invalid JSON file", function(done) {
      fs.writeFile(config.filePath+'invalid.json', "documents", function(err) {
          if(err) {
            console.log(err);
          } 
          else {
            upload.checkJSONSanity(config.filePath+'invalid.json',function(err,response){
              expect(response.code).toEqual("ISNOTJSON");
              fs.unlink(config.filePath+'invalid.json',function(){
                done();
              });
            });
          }
      //TODO add wait timeout
      });
    });
  });
  //Checking various attributes of the json file
  xdescribe("check validity of attributes",function(){
    //check the field name attribute
    describe("Fieldname attribute",function(){
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:Valid field name
      *   Expected Output: true
      */
      it("Valid fieldname", function(done) { 
        upload.checkFieldNameAttribute("documents",function(err,response){
          expect(response.code).toEqual("VALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:Valid field name
      *   Expected Output: true
      */
      it("Valid fieldname with _ & -", function(done) { 
        upload.checkFieldNameAttribute("documents-my_",function(err,response){
          expect(response.code).toEqual("VALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:invalid field name
      *   Expected Output: INVALIDFIELDNAME
      */
      it("invalid fieldname", function(done) { 
        upload.checkFieldNameAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:invalid field name
      *   Expected Output: INVALIDFIELDNAME
      */
      it("fieldname with special characters", function(done) { 
        upload.checkFieldNameAttribute("null$%",function(err,response){
          expect(response.code).toEqual("INVALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:invalid field name
      *   Expected Output: INVALIDFIELDNAME
      */
      it("fieldname with numbers", function(done) { 
        upload.checkFieldNameAttribute("documents1",function(err,response){
          expect(response.code).toEqual("INVALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if field name is valid or not
      * 
      *   Expected Input:Empty field name
      *   Expected Output: INVALIDFIELDNAME
      */
      it("Empty fieldname", function(done) { 
        upload.checkFieldNameAttribute(null,function(err,response){
          expect(response.code).toEqual("INVALIDFIELDNAME");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the size attribute
    describe("Size attribute",function(){
     /*   Test case if size is valid or not
      * 
      *   Expected Input:Valid Size JSON
      *   Expected Output: valid
      */
      it("Valid Size with only min size", function(done) { 
        upload.checkSizeAttribute(JSON.stringify({"minSize":25}),function(err,response){
          expect(response.code).toEqual("VALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:Valid Size JSON
      *   Expected Output: valid
      */
      it("Valid Size with both min and max size", function(done) { 
        upload.checkSizeAttribute(JSON.stringify({"minSize":25,"maxSize":3500}),function(err,response){
          expect(response.code).toEqual("VALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:Invalid min size with valid max size
      *   Expected Output: invalid
      */
      it("invalid min size valid max size", function(done) { 
        upload.checkSizeAttribute(JSON.stringify({"minSize":"25kb","maxSize":35}),function(err,response){
          expect(response.code).toEqual("INVALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:null max size with valid min size
      *   Expected Output: valid
      */
      it("null max size valid min size", function(done) { 
        upload.checkSizeAttribute(JSON.stringify({"minSize":25,"maxSize":null}),function(err,response){
          expect(response.code).toEqual("VALIDSIZE");          
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Size is valid or not
      * 
      *   Expected Input:Size with value
      *   Expected Output: valid
      */
      it("Size with value directly", function(done) { 
        upload.checkSizeAttribute(45,function(err,response){
          expect(response.code).toEqual("VALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:null size field
      *   Expected Output: valid
      */
      it("Empty Size", function(done) { 
        upload.checkSizeAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:Size as string
      *   Expected Output: invalid
      */
      it("Value of size in strings", function(done) { 
        upload.checkSizeAttribute("45kb",function(err,response){
          expect(response.code).toEqual("INVALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if size is valid or not
      * 
      *   Expected Input:Size as string
      *   Expected Output: invalid
      */
      it("Miscellaneous size", function(done) { 
        upload.checkSizeAttribute(JSON.stringify({"max-size":"asas"}),function(err,response){
          expect(response.code).toEqual("INVALIDSIZE");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the file type attribute
    describe("File type attribute",function(){
     /*   Test case if file type is valid or not
      * 
      *   Expected Input:Valid file type
      *   Expected Output: true
      */
      it("Valid filetype", function(done) { 
        upload.checkFileTypeAttribute("image/jpeg",function(err,response){
          expect(response.code).toEqual("VALIDFILETYPE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if file type is valid or not
      * 
      *   Expected Input:null file type
      *   Expected Output: true
      */
      it("null file type", function(done) { 
        upload.checkFileTypeAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDFILETYPE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if file type is valid or not
      * 
      *   Expected Input:invalid file type
      *   Expected Output: INVALIDFIELDNAME
      */
      it("invalid file type", function(done) { 
        upload.checkFileTypeAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDFILETYPE");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the extension attribute
    describe("Extension attribute",function(){
     /*   Test case if extension is valid or not
      * 
      *   Expected Input:Valid extension
      *   Expected Output: true
      */
      it("Valid extension", function(done) { 
        upload.checkExtensionAttribute(".jpeg",function(err,response){
          expect(response.code).toEqual("VALIDEXTENSION");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if extension is valid or not
      * 
      *   Expected Input:null extension
      *   Expected Output: true
      */
      it("null extension", function(done) { 
        upload.checkExtensionAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDEXTENSION");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if extension is valid or not
      * 
      *   Expected Input:invalid extension
      *   Expected Output: INVALIDEXTENSION
      */
      it("invalid extension", function(done) { 
        upload.checkExtensionAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDEXTENSION");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the store mode attribute
    describe("Store mode attribute",function(){
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:Valid store mode
      *   Expected Output: true
      */
      it("Valid Store mode", function(done) { 
        upload.checkStoreModeAttribute("directory",function(err,response){
          expect(response.code).toEqual("VALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:null store mode
      *   Expected Output: invalid
      */
      it("null store mode", function(done) { 
        upload.checkStoreModeAttribute(null,function(err,response){
          expect(response.code).toEqual("INVALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:numeric store mode
      *   Expected Output: INVALIDSTOREMODE
      */
      it("numeric store mode", function(done) { 
        upload.checkStoreModeAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:invalid store mode
      *   Expected Output: INVALIDSTOREMODE
      */
      it("invalid store mode", function(done) { 
        upload.checkStoreModeAttribute("hello",function(err,response){
          expect(response.code).toEqual("INVALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:valid store mode
      *   Expected Output: VALIDSTOREMODE
      */
      it("valid store mode REST", function(done) { 
        upload.checkStoreModeAttribute("REST",function(err,response){
          expect(response.code).toEqual("VALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the rename schema attribute
    describe("Rename schema attribute",function(){
     /*   Test case if Rename Schema is valid or not
      * 
      *   Expected Input:Valid store mode
      *   Expected Output: true
      */
      it("Valid rename schema", function(done) { 
        upload.checkRenameSchemaAttribute("original",function(err,response){
          expect(response.code).toEqual("VALIDRENAMESCHEMA");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Rename Schema is valid or not
      * 
      *   Expected Input:null rename schema
      *   Expected Output: valid
      */
      it("null rename schema", function(done) { 
        upload.checkRenameSchemaAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDRENAMESCHEMA");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Rename schema is valid or not
      * 
      *   Expected Input:numeric rename schema
      *   Expected Output: INVALIDRENAMESCHEMA
      */
      it("numeric rename schema", function(done) { 
        upload.checkRenameSchemaAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDRENAMESCHEMA");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Rename schema is valid or not
      * 
      *   Expected Input:invalid Rename schema
      *   Expected Output: INVALIDRENAMESCHEMA
      */
      it("invalid rename schema", function(done) { 
        upload.checkRenameSchemaAttribute("hello",function(err,response){
          expect(response.code).toEqual("INVALIDRENAMESCHEMA");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:valid store mode
      *   Expected Output: VALIDRENAMESCHEMA
      */
      it("valid Rename schema UUID", function(done) { 
        upload.checkRenameSchemaAttribute("UUID",function(err,response){
          expect(response.code).toEqual("VALIDRENAMESCHEMA");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the delete after transfer attribute
    describe("Delete after transfer attribute",function(){
     /*   Test case if delete after transfer is valid or not
      * 
      *   Expected Input:Valid value of delete after transfer
      *   Expected Output: true
      */
      it("Valid delete after transfer", function(done) { 
        upload.checkDeleteAfterTransferAttribute(true,function(err,response){
          expect(response.code).toEqual("VALIDDELETEAFTERTRANSFER");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if delete after transfer is valid or not
      * 
      *   Expected Input:null delete after transfer
      *   Expected Output: valid
      */
      it("null delete after transfer", function(done) { 
        upload.checkDeleteAfterTransferAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDDELETEAFTERTRANSFER");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if delete after transfer is valid or not
      * 
      *   Expected Input:numeric delete after transfer
      *   Expected Output: INVALIDDELETEAFTERTRANSFER
      */
      it("numeric delete after transfer", function(done) { 
        upload.checkDeleteAfterTransferAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDDELETEAFTERTRANSFER");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the rename prefix attribute
    describe("Rename_prefix attribute",function(){
     /*   Test case if Rename_prefix is valid or not
      * 
      *   Expected Input:Valid Rename_prefix
      *   Expected Output: valid
      */
      it("Valid Rename_prefix", function(done) { 
        upload.checkRenamePrefixAttribute("image/jpeg",function(err,response){
          expect(response.code).toEqual("VALIDRENAMEPREFIX");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Rename_prefix is valid or not
      * 
      *   Expected Input:null Rename_prefix
      *   Expected Output: valid
      */
      it("null Rename_prefix", function(done) { 
        upload.checkRenamePrefixAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDRENAMEPREFIX");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Rename_prefix is valid or not
      * 
      *   Expected Input:invalid Rename_prefix
      *   Expected Output: INVALIDRENAMEPREFIX
      */
      it("invalid Rename_prefix", function(done) { 
        upload.checkRenamePrefixAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDRENAMEPREFIX");
          done();
        });
        //TODO add wait timeout
      });
    });
    //check the Overwrite attribute
    describe("Overwrite attribute",function(){
     /*   Test case if Overwrite is valid or not
      * 
      *   Expected Input:Valid value of Overwrite
      *   Expected Output: true
      */
      it("Valid Overwrite", function(done) { 
        upload.checkOverwriteAttribute(true,function(err,response){
          expect(response.code).toEqual("VALIDOVERWRITE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Overwrite is valid or not
      * 
      *   Expected Input:null overwrite
      *   Expected Output: valid
      */
      it("null Overwrite", function(done) { 
        upload.checkOverwriteAttribute(null,function(err,response){
          expect(response.code).toEqual("VALIDOVERWRITE");
          done();
        });
        //TODO add wait timeout
      });
     /*   Test case if Overwrite is valid or not
      * 
      *   Expected Input:numeric Overwrite
      *   Expected Output: INVALIDOVERWRITE
      */
      it("numeric overwrite", function(done) { 
        upload.checkOverwriteAttribute(54242,function(err,response){
          expect(response.code).toEqual("INVALIDOVERWRITE");
          done();
        });
        //TODO add wait timeout
      });
    });
  });
it("main",function(done){
  upload.main(12,function(err,response){
    done();
  })
})
});


