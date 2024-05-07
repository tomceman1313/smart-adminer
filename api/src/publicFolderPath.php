<?php
$ENV = parse_ini_file('.env');

$path = $ENV["DEV_MODE"] == 1 ? "../public" : "../";
// development
//$path = '../public';
// production
//$path = '../';