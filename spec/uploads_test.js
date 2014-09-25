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
 /*   Test case if file does not exist
  * 
  *   Expected Input: filename
  *   Expected Output: JSON object with error message file does not exist
  */
  describe("readJSONFromFile",function(){
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
  describe("checkJSONSanity",function(){
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
   /*   Test case if file is empty JSON file
    * 
    *   Expected Input: filename
    *   Expected Output: Error code ISNOTJSON
    */
    // it("Empty JSON file", function(done) {
    //   fs.writeFile(config.filePath+'empty.json', function(err) {
    //       if(err) {
    //         console.log(err);
    //       } 
    //       else {
    //         upload.checkJSONSanity(config.filePath+'empty.json',function(err,response){
    //           expect(response.code).toEqual("ISEMPTY");
    //           done();
    //           fs.unlinkSync(config.filePath+'empty.json');
    //         });
    //       }
    //   //TODO add wait timeout
    //   });
    // });
  });
  describe("check validity of attributes",function(){
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
      *   Expected Output: INVALIDSTOREMODE
      */
      it("valid store mode REST", function(done) { 
        upload.checkStoreModeAttribute("REST",function(err,response){
          expect(response.code).toEqual("VALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
    });
    describe("Delete after transfer attribute",function(){
     /*   Test case if store mode is valid or not
      * 
      *   Expected Input:Valid store mode
      *   Expected Output: true
      */
      it("Valid delete after transfer", function(done) { 
        upload.checkStoreModeAttribute(true,function(err,response){
          expect(response.code).toEqual("VALIDDELETEAFTERTRANSFER");
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
    });
    describe("Overwrite attribute",function(){
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
      *   Expected Output: INVALIDSTOREMODE
      */
      it("valid store mode REST", function(done) { 
        upload.checkStoreModeAttribute("REST",function(err,response){
          expect(response.code).toEqual("VALIDSTOREMODE");
          done();
        });
        //TODO add wait timeout
      });
    });
  });
});


