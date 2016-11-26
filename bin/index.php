<?php


$fileName =  htmlspecialchars($_GET["name"]);

echo exec('java -jar scheduler.jar uploads/'.$fileName);

$fileContents = file_get_contents('outFile.txt');
echo $fileContents;

?>
