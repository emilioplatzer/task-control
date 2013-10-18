"use strict";

var hoy=new Date();

var idCheck=function(evento){
    this.checked=!this.checked;
    this.src=this.checked?'cuadro-punteado-check.png':'cuadro-punteado.png';
    var cuantos=0;
    for(var i=0; i<mensajes.length; i++){
        if(document.getElementById('check_'+mensajes[i].id).checked){
            cuantos++;
        }
    }
    seleccionados.style.visibility=cuantos>1?'visible':'hidden';
    document.getElementById('cuantos_seleccionados').innerText=cuantos;
}

var seleccionarTodo=function(evento){
    var todosEncendidos=true;
    for(var i=0; i<mensajes.length; i++){
        if(document.getElementById('check_'+mensajes[i].id) && !document.getElementById('check_'+mensajes[i].id).checked){
            todosEncendidos=false;
        }
    }
    var cuantos=0;
    for(var i=0; i<mensajes.length; i++){
        if(document.getElementById('check_'+mensajes[i].id)){
            document.getElementById('check_'+mensajes[i].id).checked=!todosEncendidos;
            document.getElementById('check_'+mensajes[i].id).src=!todosEncendidos?'cuadro-punteado-check.png':'cuadro-punteado.png';
            cuantos++;
        }
    }
    if(todosEncendidos){
        cuantos=0;
    }
    seleccionados.style.visibility=cuantos>1?'visible':'hidden';
    document.getElementById('cuantos_seleccionados').innerText=cuantos+'';
}

var paraMostrar=function(destino, valor){
    if('innerText' in destino){
        destino.innerText=valor;
    }
}

var paraMostrarEmail=function(destino, valor){
    if('innerText' in destino){
        destino.innerText=(valor||'').replace('@gmail.com','');;
    }
}

var paraMostrarFecha=function(destino, valor){
    if('innerText' in destino){
        var fecha=new Date(valor);
        var sin_annio=fecha.getUTCDate()+'/'+(fecha.getUTCMonth()+1)
        if(fecha.getUTCFullYear()==hoy.getUTCFullYear()){
            destino.innerText=sin_annio;
        }else{
            destino.innerHTML=sin_annio+'<small>/'+fecha.getUTCFullYear()+'</small>';
        }
    }
}

var agregarleBoton=function(destino,label,id,color,accion){
    var boton=document.createElement('button');
    destino.appendChild(boton);
    boton.valor=label;
    boton.innerText=label;
    if(id){
        if(accion=='deshacer'){
            boton.onclick=function(){
                var fila=document.getElementById('fila_'+id);
                clearTimeout(fila.porEnviar);
                fila.porEnviar=null;
                var celda_vencimiento=document.getElementById('col_vencimiento_'+id);
                celda_vencimiento.innerHTML=celda_vencimiento.ocultoHTML;
                fila.botonPresionado.style.backgroundColor='';
                for(var i=0; i<fila.cells.length; i++){
                    fila.cells[i].style.backgroundColor='white';
                }
            }
        }else{
            boton.onclick=function(){
                var fila=document.getElementById('fila_'+id);
                if(!fila.porEnviar){
                    this.style.backgroundColor=color;
                    var tabla=document.getElementById('tabla_mensajes');
                    var celda_vencimiento=document.getElementById('col_vencimiento_'+id);
                    celda_vencimiento.ocultoHTML=celda_vencimiento.innerHTML;
                    celda_vencimiento.innerHTML='';
                    var boton_deshacer=agregarleBoton(celda_vencimiento,'deshacer',id,'cyan','deshacer');
                    boton_deshacer.style.backgroundColor='yellow';
                    fila.porEnviar=setTimeout(function(){
                        enviar({accion:'enviar_respuesta', id:id, respuesta:label, rapida:null},function(respuesta){
                            tabla.deleteRow(fila.rowIndex); 
                        });
                    },3000);
                    fila.botonPresionado=this;
                    for(var i=0; i<fila.cells.length; i++){
                        fila.cells[i].style.backgroundColor='#BFBFBF';
                    }
                }
            }
        }
    }
    return boton;
}

var paraMostrarSiNo=function(destino, valor,id){
    if('innerText' in destino){
        agregarleBoton(destino,'Sí',id,'green');
        agregarleBoton(destino,'No',id,'red');
    }
}

var paraMostrarLink=function(destino, valor){
    if('innerText' in destino){
        var anchor=document.createElement('a');
        var imagen=document.createElement('img');
        imagen.src='gmail.png';
        anchor.appendChild(imagen);
        destino.appendChild(anchor);
    }
}

var paraMostrarId=function(destino, valor){
    var check=document.createElement('img');
    check.src='cuadro-punteado.png';
    check.mi_id=valor;
    check.onclick=idCheck;
    check.id='check_'+valor;
    destino.appendChild(check);
}

var campos={
    id:         { titulo:'', tipo:'id', mostrar:paraMostrarId },
    remitente:  { titulo:'Remitente', mostrar:paraMostrarEmail },
    asunto:     { titulo:'Asunto' },
    vencimiento:{ titulo:'Vencimiento', tipo:'fecha', mostrar:paraMostrarFecha },
    rapida:     { titulo:'Respuesta Rápida'},
    respuesta:  { titulo:'', tipo:'respuesta', mostrar:paraMostrarSiNo },
    link:       { titulo:'', tipo:'link' , mostrar:paraMostrarLink},
}
/* Otros campos que no se ven tipo:
    emitido (fecha)
    respondido (fecha)
    ocultado (fecha)
    destinatario (email)
*/
    
var mensajes=[
    {id:33, remitente:'Pedro', asunto:'Necesito cotización de toner para HP', vencimiento:'2013-10-19', respuesta:'', rapida:'', link:''},
    {id:35, remitente:'José' , asunto:'Falta comprar sandwichitos'          , vencimiento:'2013-10-21', respuesta:'', rapida:'', link:''},
    {id:37, remitente:'María', asunto:'Venis de vacaciones conmigo?'        , vencimiento:'2014-1-2'  , respuesta:'', rapida:'', link:''},
    {id:38, remitente:'Pepe',  asunto:'Necesito un toner'                   , vencimiento:'2013-11-5'  , respuesta:'', rapida:'', link:''},
]

function enviar(parametros,alterminar,fondo){
    if(!fondo){
        fondo=document.getElementById('logo');
    }
    var peticion=new XMLHttpRequest();
    peticion.onreadystatechange=function(){
      switch(peticion.readyState) { 
        case 4:
            var respuestaJSON = peticion.responseText;
            try{
                var respuesta = JSON.parse(respuestaJSON);
                alterminar(respuesta);
            }catch(err){
                fondo.style.backgroundColor='orange';
                fondo.title=err+' '+respuestaJSON;
            }
      }
    }
    peticion.open('POST','servidor.php',true);
    peticion.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    peticion.send('todo='+JSON.stringify(parametros));
}

function refrescar(){
    var boton=document.getElementById('boton_refrescar');
    boton.style.backgroundColor='';
    enviar({accion:'listar_pendientes'},function(respuesta){
        mensajes=respuesta.mensajes;
        poblar_tabla();
    },boton);
}

function poblar_tabla(){
    var tabla=document.getElementById('tabla_mensajes');
    tabla.innerHTML='';
    var titulos=tabla.insertRow(-1);
    for(var nombre_campo in campos){
        var def_campo=campos[nombre_campo];
        var td=titulos.insertCell(-1);
        td.innerText='titulo' in def_campo?def_campo.titulo:nombre_campo;
        td.className='titulo';
    }
    for(var i=0; i<mensajes.length; i++){
        var fila=tabla.insertRow(-1);
        var id=mensajes[i].id;
        fila.id='fila_'+id;
        for(nombre_campo in campos){
            var def_campo=campos[nombre_campo];
            var td=fila.insertCell(-1);
            td.className='col_'+nombre_campo;
            td.id='col_'+nombre_campo+'_'+id;
            (def_campo.mostrar||paraMostrar)(td,mensajes[i][nombre_campo],id);
        }
    }
}

function armar_pantalla_inicial(){
    var div=document.getElementById('resultados');
    var tabla=document.createElement('table');
    tabla.id='tabla_mensajes';
    div.appendChild(tabla);
    document.getElementById('boton_refrescar').onclick=refrescar;
    document.getElementById('boton_seleccionar_todo').onclick=seleccionarTodo;
    document.getElementById('nombre_usuario').innerText='+Emilio';
    agregarleBoton(document.getElementById('seleccionados'),'Sí');
    agregarleBoton(document.getElementById('seleccionados'),'No');
    refrescar();
    // poblar_tabla();
}

window.addEventListener('load', armar_pantalla_inicial);