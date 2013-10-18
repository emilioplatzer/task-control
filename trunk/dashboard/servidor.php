<?php

$todo=json_decode(@$_REQUEST['todo']?:'{}');
$accion=(@$todo->accion)?:'nada';
$usuario_actual='emilioplatzer@gmail.com';

function abrirDB(){
    $db=new PDO('mysql:dbname=taskcontrol;host=localhost', 'root', 'admin');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
}

function ejecutarSQL($db,$sql,$parametros){
    $sentencia=$db->prepare($sql);
    $sentencia->execute($parametros);
    return $sentencia->fetchAll(PDO::FETCH_ASSOC);
}

/////////////////////////////////////////////////////////////////////////////

$funcion='accion_'.$accion;

if(!function_exists($funcion)){
    $funcion='accion_nada';
}
$funcion();

function noCacheHeadersXML(){
	header("Content-Type:application/json");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);	
	header("Pragma: no-cache");
}

noCacheHeadersXML();

function accion_nada(){
    echo "[]";
}

function accion_listar_pendientes(){
    global $usuario_actual;
    $mensajes=ejecutarSQL(abrirDB(),'SELECT * FROM `mensajes` WHERE `destinatario` = :usuario',array(':usuario'=>$usuario_actual));
    echo json_encode(array('mensajes'=>$mensajes));
    // http://localhost/tc/dashboard/servidor.php?todo={"accion":"listar_pendientes"}
}
?>