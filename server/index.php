<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

function getToken() {
  header('Content-Type: application/json; charset=UTF-8');
  echo '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciJ9.J6n4-v0I85zk9MkxBHroZ9ZPZEES-IKeul9ozxYnoZ8"}';
}

function importByURL() {
	header('Content-Type: application/json; charset=UTF-8');	

	if (empty($_GET['url'])) return 'URL is not defined';

    require_once ('markdownToJson.php');
    echo convertMarkdownToJson($_GET['url']);
}

echo router([
  'GET:auth/token' => 'getToken',
  'GET:import' => 'importByURL',
]);

function router($routes) {
  foreach ($routes as $rule => $func) {
    $parts = explode(':', $rule);
    if (
      count($parts) == 2
      && $_SERVER['REQUEST_METHOD'] == $parts[0]
      && preg_match('/' . addcslashes($parts[1], '/') . '/i', $_SERVER['REQUEST_URI'])
    ) {
      if (function_exists($func)) {
        return $func();
      } else {
        throw new Exception("Function $func doesn't exists", 1);
      }
    }
  }
  echo 'Endpoint "' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . '" not found';
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
