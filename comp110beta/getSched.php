<?php
$onyen =  htmlspecialchars($_POST["onyen"]);



// Get cURL resource
$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt($curl,CURLOPT_USERAGENT, 'cphamlet');
//gives the access token to the GitHub API for authorization
 curl_setopt($curl,CURLOPT_URL,'https://api.github.com/repos/comp110/KarenBot/contents/data/spring-17/staff/'.$onyen.'.csv?access_token=793cb9edb084f7533c530d9ac4433786c4eca496');
 //return curl_exec value as a string instead of output
 curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);



curl_setopt($curl,CURLOPT_CONNECTTIMEOUT,8);
curl_setopt($curl,CURLOPT_TIMEOUT,8);
//This response gives the temporary HTTP token in order to retreive the CSV from GitHub
$response  = curl_exec($curl);



// Close request to clear up some resources
$response = json_decode($response);
$response = $response->{'download_url'};

$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt($curl,CURLOPT_USERAGENT, 'cphamlet');
//curl_setopt($curl,CURLOPT_HTTPHEADER, 'Authorization: token

//url looks something like: https://raw.githubusercontent.com/comp110/KarenBot/master/data/spring-17/staff/atsirk.csv?token=asjbajbefajbfjsbdfjJHBF, but isn't because the token changes 

curl_setopt($curl,CURLOPT_URL,$response);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($curl,CURLOPT_CONNECTTIMEOUT,8);
curl_setopt($curl,CURLOPT_TIMEOUT,8);

$response  = curl_exec($curl);
//output csv back to the client
echo $response;
curl_close($curl);

//echo $onyen."reey";

?>
