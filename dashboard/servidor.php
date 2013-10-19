<?php
$todo=json_decode(@$_POST['todo']?:'{}');
$accion=(@$todo->accion)?:'nada';
$usuario_actual='emilioplatzer@gmail.com';

if(getenv('COMPUTERNAME')=='EVAIO'){

    function abrirDB(){
        $db=new PDO('mysql:dbname=taskcontrol;host=localhost;charset=utf8', 'root', 'admin');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    }

    function ejecutarSQL($db,$sql,$parametros){
        $sentencia=$db->prepare($sql);
        $sentencia->execute($parametros);
        if(substr($sql,0,6)=='SELECT'){
            return $sentencia->fetchAll(PDO::FETCH_ASSOC);
        }
    }

}else{

    require('clases/MySQL.php');

    function abrirDB(){
        $db= MySQL::getInstance();
        return $db;
    }

    function ejecutarSQL($db,$sql,$parametros){
        foreach($parametros as $key => $value){
            $sql_text = str_replace($key,"'".$value."'",$sql);
        }
        echo $sql_text;
        $db->setQuery($sql_text);
        $db->execute();
        if(substr($sql,0,6)=='SELECT'){
            $resultados = $db->loadObjectList();
            return $resultados;
        }
    }

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
    global $todo;
    $mensajes=ejecutarSQL(abrirDB(),
        'SELECT * FROM `mensajes` WHERE `destinatario` = :destinatario AND `respuesta` IS NULL ORDER BY `vencimiento`'
    ,array(
        ':destinatario'=>$todo->destinatario
    ));
    echo json_encode(array('mensajes'=>$mensajes));
    // http://localhost/tc/dashboard/servidor.php?todo={"accion":"listar_pendientes"}
}

function accion_enviar_respuesta(){
    global $todo;
    ejecutarSQL(abrirDB(),
        'UPDATE `mensajes` SET `respuesta` = :respuesta, `rapida` = :rapida WHERE id = :id'
    ,array(
        ':respuesta'=>$todo->respuesta,
        ':rapida'   =>$todo->rapida   ,
        ':id'       =>$todo->id
    ));
    echo '{}';
}

function accion_identificar(){
    global $todo;
    echo json_encode(array('user'=>'emilioplatzer@gmail.com'));
}
?>