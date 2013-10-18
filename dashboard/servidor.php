<?php

$accion=@$_REQUEST['accion']||'nada';
$funcion='accion_'.$accion;

if(!function_exists($funcion)){
    $funcion='accion_nada';
}

function noCacheHeadersXML(){
	header("Content-Type:application/json");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);	
	header("Pragma: no-cache");
}

noCacheHeadersXML();

function accion_nada(){
    echo "{}";
}

function accion_pendientes(){
    $mensajes=<<<JSON
        
JSON;
}
?>