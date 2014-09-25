upload-manager-node (under-development)
===================

A universal upload manager which operates based on profiles. This uploader is mainly a server side controller which manages uploading of various types of file. One can manage uploading of various types of files by creating their own custom upload profiles in the **Upload library**. The upload manager is mainly divided into 3 parts. They are as follows :-

1. **Upload profiles:** This is a JSON file where in you can add your custom profiles that you want to use for your uploader.Various fields of an *upload profile* are explained below :-
  * **Field name:** It specifies the upload profile, that the uploaded file refers to. Eg. A company logo can have a field name called 'logo' that refers to the 'logo' profile of the upload library.
  * **Size:** It specifies the minimum and maximum size of the file allowed.
  * **File type:** MIME types of the various file types. Eg. image/jpeg,image/png. If the file type is 'image' then following other attributes would also be included viz.
    * *Image dimensions:* Dimensions of image in pixels that is eligible for uploading.
    * *Minimum image height:* Minimum height of image.
    * *Maximum image height:* Maximum height of image.
    * *Minimum image width:* Minimum width of image.
    * *Maximum image width:* Maximum width of image.
  * **Extension:** Extensions that are supported to be uploaded for a particular upload profile. Eg. .jpeg,.png.
  * **Store mode:** This field would specify the mode of storage for the file being uploaded. i.e. the store mode would tell the server *what to do* with the file being uploaded.There are 3 store modes supported by our system viz.
    * *Directory mode:* This mode is for normal file uploading i.e. the file would be uploaded to a specified path. For this mode a *Directory location* field would be provided where the file would be stored on the server.
    * *REST mode:* This mode would send the contents of the file directly to a specified URL. For this mode a *URL-location* field would be provided where the contents of the file would be sent.
    * *Database mode:* This mode would store the file into the database.A *Database config* field would be included to give the configurations of the database to be used.(Note: This feature would be released as a future enhancement)
  * **Delete after transfer:** This is a boolean field. If it is set to true then the file would be deleted from the temp folder after uploading it to the specified location.
  * **Rename scheme:** This field specifies various modes of renaming a file.i.e. the file name would be appended with an _1,_2,... or with a 'UUID' or with a time stamp as per the mode specified in this field.
  * **Overwrite:** This is a boolean field. If set to true, the file with that name(if already exists on the specified path) would be overwritten.
  * **Rename_prefix:** This specifies a prefix to be appended with the file name. Eg. A file named 'bird.jpg' would be stored as 'axi-bird.jpg', if the `'Rename_prefix'` field is set to 'axi-'.

2. **Upload Library:** This is the core file of our uploader. It checks if the file being uploaded meets all the constraints specified in the upload profile(being referred to by the `Field name` field).
  * If it successfully meets all the constraints, then it would perform file operation as per the value in the `Store mode` field.
  * If the file fails to meet some of the constraints, then proper error messages would be sent to the user.
3. **Uploader Endpoint:** This endpoint acts as a mediator between the client and the **Upload Library**. It handles the request from the client and sends it to the upload library for further proceedings. It acts as an entry point to the system.

####Sample Upload profile for image upload
    {
    "Field name":"image",
    "Size":{
             "min":"5kb",
             "max":"2000kb"
           },
    "File type":"image/gif,image/png,image/jpeg,image/bmp",
    "Image":{
              "Min image height":"200px",
              "Max image height":"500px",
              "Min image width":"200px",
              "Max image width":"600px"
            }
    "Extension":".gif,.png,.jpeg,.jpg,.bmp",
    "Store mode":"directory",
    "Directory location":"/uploads/images/",
    "Delete after transfer":true,
    "overwrite":false,
    "Rename Scheme":"original",
    "Rename_prefix":"axi-"
    }
The above upload profile allows us to impose various constraints such as min size, max size,image type that can be uploaded, min-max image height-width that is eligible etc. on the file being uploaded. If the incoming file meets all the constraints then the file would be stored to '/uploads/images' directory and the file stored in the temporary folder would be deleted.If the file with the same name already exists at the specified location then the file name would be appended with _1,_2,... suffix. The file name would also be appended with the 'axi-' prefix.

####Sample Upload profile for pdf/doc upload
    {
    "Field name":"documents",
    "Size":{
             "min":"5kb",
             "max":"10000kb"
           },
    "File type":"application/pdf,application/msword",
    "Extension":".pdf,.doc,.docx",
    "Store mode":"REST",
    "URL location":"http://www.domainname.com/uploads/files/",
    "Delete after transfer":true,
    "overwrite":false,
    "Rename Scheme":"original",
    "Rename_prefix":"axi-"
    }
The above upload profile allows us to impose various constraints such as min size, max size,file type that can be uploaded etc. on the file being uploaded. If the incoming file meets all the constraints then the file would be sent to the URL location 'http://www.domainname.com/uploads/files/' and the file stored in the temporary folder would be deleted.

####Various possible fields and their possible values for an upload profile

 <table>
  <tr>
   <th>
   Fields
   </th>
   <th>
   Possible set of values
   </th>
  </tr>
  <tr>
   <td>
   Field name
   </td>
   <td>
   Any name you want to give to your upload profile
   </td>
  </tr>
  <tr>
   <td>
   Size
   </td>
   <td>
Any specific max size and min size (in kb).
   </td>
  </tr>
  <tr>
   <td>
   File type
   </td>
   <td>
   MIME types of file that are allowed to be uploaded. Refer above given example.
   </td>
  </tr>
  <tr>
   <td>
   Extensions
   </td>
   <td>
   Extensions of file that are eligible for uploading.Refer above given example.
   </td>
  </tr>
  <tr>
   <td>
Store mode
   </td>
   <td>
   <ol>
   <li>Directory: File will be uploaded to the directory specified in `directory location` field.
   </li>
   <li>REST: File will be sent to the URL specified in `URL location` field.
   </li>
   <li>Database: File will be uploaded to the database as per the config specified in `Database config` field.
   </li>
   </ol>
   </td>
  </tr>
  <tr>
 <td>
 Delete after transfer
 </td>
 <td>
 Boolean values (true or false).
 </td>
</tr>
 <tr>
 <td>
 Overwrite
 </td>
 <td>
 Boolean values (true or false)
 </td>
</tr>
 <tr>
 <td>
 Rename Scheme
 </td>
 <td>
 <ol>
 <li>Original: The file name would be appended with _1,_2,... suffix.
 </li>
 <li>UUID: The file name would be appended with  a randomly generated `UUID` string suffix.
 </li>
 <li>Timestamp: The file name would be appended with a milliseconds suffix (generated with `(new Date().getTime())`).
 </li>
 </ol>
 </td>
</tr>
 <tr>
 <td>
 Rename_prefix
 </td>
 <td>
 Any prefix you want to append with your file name.
 </td>
</tr>

#### A sample file uploader(client side)
**Upload.html**

    <html>
      <head>
        <title>Upload Example</title>
        <link rel="stylesheet" href="./css/common.css"></link>
      </head>
      <body>
        <form id="uploadForm"
          enctype="multipart/form-data"
          action="http://localhost:1337/upload/documents"
          method="post">
          <input type="file" multiple="multiple" id="userPhotoInput" name="documents" />
          <!--The name field of the input type="file" should match with the parameter name passed as the last parameter in the action field of the form attribute which would tell the upload library which upload profile to select-->
        </form>
        <span id="status" />
        <img id="uploadedImage" />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script src="jquery.form.js"></script>
        <script src="upload.js"></script>
      </body>
    </html>

**Upload.js**

    $(document).ready(function() {
      status('Choose a file :)');
      // Check to see when a user has selected a file
      var timerId;
      timerId = setInterval(function() {
	  if($('#userPhotoInput').val() !== '') {
            clearInterval(timerId);
            $('#uploadForm').submit();
        }
      }, 500);
      $('#uploadForm').submit(function() {
          status('uploading the file ...');
            $(this).ajaxSubmit({
              error: function(xhr) {
  		      status('Error: ' + xhr.status);
              },
              success: function(response) {
                status(JSON.stringify(response));
  		    }
  	      });

  	// Have to stop the form from submitting and causing
  	// a page refresh - don't forget this
  	return false;
      });

      function status(message) {
  	     $('#status').text(message);
      }
    });
This example directly sends the file to the server without the need of a submit button.
