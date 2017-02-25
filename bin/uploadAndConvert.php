<?php

$uploadOk = 1;

// Check file size greater than 5 Mb
if ($_FILES["uploadedFilename"]["size"] > 5000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
$filename = $_FILES['uploadedFilename']['name'];
$filename = htmlspecialchars($filename);
$pathAndFile = "./uploads/".$filename;

if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else if ( move_uploaded_file (htmlspecialchars($_FILES['uploadedFilename'] ['tmp_name']), 
      $pathAndFile)  )
      {
	  exec('java -jar scheduler.jar '.$pathAndFile);
	  $fileContents = file_get_contents('outFile.txt');
	  echo $fileContents;
	  print '<p> The file has been successfully uploaded </p>';
       }
else
      {   // error handling code goes here
        print '<p> There has been an error uploading the file </p>';
        //print_r(error_get_last());
        //var_dump($_FILES);
        switch ($_FILES['name'] ['error'])
 {  case 1:
           print '<p> The file is bigger than this PHP installation allows</p>';
           break;
    case 2:
           print '<p> The file is bigger than this form allows</p>';
           break;
    case 3:
           print '<p> Only part of the file was uploaded</p>';
           break;
    case 4:
           print '<p> No file was uploaded</p>';
           break;
 }
       }


?>
