<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

function getToken() {
  header('Content-Type: application/json; charset=UTF-8');
  echo '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciJ9.J6n4-v0I85zk9MkxBHroZ9ZPZEES-IKeul9ozxYnoZ8"}';
}

router([
  'auth\/getToken' => 'getToken'
]);

function router($routes) {
  foreach ($routes as $url => $func) {
    if (preg_match("/$url/i", $_SERVER['REQUEST_URI'])) {
      if (function_exists($func)) {
        return $func();
      } else {
        throw new Exception("Function $func doesn't exists", 1);
      }
    }
  }
  echo 'Default page';
}

function dump($o) {
  error_log(print_r($o, true));
}

function pr($o) {
  echo '<pre>';
  var_dump($o);
  echo '</pre>';
}
/*
?>
<pre>
<?php
foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
}
?>
</pre>
*/
