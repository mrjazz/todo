<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');
?>
<pre>
<?php
foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
}
?>
</pre>