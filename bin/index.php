<?php

$fileContents = file_get_contents('outFile.txt');
echo $fileContents;
unlink('outFile.txt');
?>
