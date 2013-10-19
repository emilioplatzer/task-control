"use strict";

var hoy=new Date();

var token=null;
var usuario=null;

var idCheck=function(evento){
    this.checked=!this.checked;
    this.src=this.checked?'cuadro-punteado-check.png':'cuadro-punteado.png';
    var cuantos=0;
    var todosEncendidos=true;
    for(var i=0; i<mensajes.length; i++){
        if(document.getElementById('check_'+mensajes[i].id).checked){
            cuantos++;
        }else{
            todosEncendidos=false;
        }
    }
    document.getElementById('boton_marcar_todo').src=todosEncendidos?'cuadro-punteado-check.png':'cuadro-punteado.png';
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
    document.getElementById('boton_marcar_todo').src=!todosEncendidos?'cuadro-punteado-check.png':'cuadro-punteado.png';
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
        destino.innerText=(valor||'').replace('@gmail.com','');
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
        var dias=Math.floor((fecha.getTime()-(new Date()).getTime())/(1000*60*60*24));
        var LIMITEDIAS=7;
        if(dias<=0){
            destino.style.backgroundColor='rgb(255,100,100)';
        }else if(dias<LIMITEDIAS/2){
            destino.style.backgroundColor='rgb(255,'+Math.floor(dias*310/LIMITEDIAS+100)+',100)';
        }else{
            if(dias>LIMITEDIAS){
                dias=LIMITEDIAS;
            }
            destino.style.backgroundColor='rgb('+Math.floor(510-dias*310/LIMITEDIAS)+',255,100)';
        }
        destino.colorVencimiento=destino.style.backgroundColor;
    }
}

var agregarleBoton=function(destino,label,id,color,accion){
    var imagenes={'Sí': 'boton-si.png', 'No':'boton-no.png'};
    var boton;
    if(imagenes[label]){
        boton=document.createElement('img');
        boton.src=imagenes[label];
    }else{
        boton=document.createElement('button');
        boton.innerText=label;
    }
    boton.valor=label;
    boton.className='boton_apretable';
    destino.appendChild(boton);
    if(id){
        if(accion=='deshacer'){
            boton.onclick=function(){
                var fila=document.getElementById('fila_'+id);
                clearTimeout(fila.porEnviar);
                fila.porEnviar=null;
                var celda_vencimiento=document.getElementById('col_vencimiento_'+id);
                celda_vencimiento.innerHTML=celda_vencimiento.ocultoHTML;
                fila.boton1.className='boton_apretable';
                fila.boton2.className='boton_apretable';
                for(var i=0; i<fila.cells.length; i++){
                    fila.cells[i].style.backgroundColor=fila.cells[i].colorVencimiento||'white';
                }
            }
        }else{
            boton.onclick=function(){
                var fila=document.getElementById('fila_'+id);
                if(!fila.porEnviar){
                    //this.style.backgroundColor=color;
                    fila.boton1.className='boton_obscuro';
                    fila.boton2.className='boton_obscuro';
                    this.className='boton_apretado';
                    var tabla=document.getElementById('tabla_mensajes');
                    var celda_vencimiento=document.getElementById('col_vencimiento_'+id);
                    celda_vencimiento.ocultoHTML=celda_vencimiento.innerHTML;
                    celda_vencimiento.innerHTML='';
                    var boton_deshacer=agregarleBoton(celda_vencimiento,'deshacer',id,'cyan','deshacer');
                    boton_deshacer.style.backgroundColor='cyan';
                    fila.porEnviar=setTimeout(function(){
                        enviar({accion:'enviar_respuesta', 
                            id:id, 
                            respuesta:label, 
                            rapida:document.getElementById('col_rapida_'+id).innerText||null
                        },function(respuesta){
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
        destino.parentNode.boton1=agregarleBoton(destino,'Sí',id,'green');
        destino.parentNode.boton2=agregarleBoton(destino,'No',id,'red');
    }
}

var paraMostrarLink=function(destino, valor){
    if('innerText' in destino){
        var anchor=document.createElement('a');
        var imagen=document.createElement('img');
        imagen.src='gmail.png';
        if(valor){
            imagen.onclick=function(){
                window.open('https://mail.google.com/mail/u/0/?shva=1#inbox/'+valor, '_blank');
            }
        }
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

var campos_esperados={
    id:          { titulo:'', tipo:'id', mostrar:paraMostrarId },
    destinatario:{ titulo:'Destinatario', mostrar:paraMostrarEmail, colspan:2 },
    asunto:      { titulo:'Asunto' },
    vencimiento: { titulo:'Límite', tipo:'fecha', mostrar:paraMostrarFecha },
    rapida:      { titulo:'Respuesta' },
    respuesta:   { titulo:'', mostrar:paraMostrarSiNo },
}

var campos_pendientes={
    id:         { titulo:'', tipo:'id', mostrar:paraMostrarId },
    remitente:  { titulo:'Remitente', mostrar:paraMostrarEmail, colspan:2, linkear:true },
    asunto:     { titulo:'Asunto', linkear:true },
    vencimiento:{ titulo:'Límite', tipo:'fecha', mostrar:paraMostrarFecha, linkear:true },
    rapida:     { titulo:'Respuesta Rápida', contentEditable:true},
    respuesta:  { titulo:'', tipo:'respuesta', mostrar:paraMostrarSiNo },
}

var campos=campos_pendientes;
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
            var respuestaCruda = peticion.responseText;
            try{
                if(parametros.url){
                    var respuesta={
                        cruda:respuestaCruda,
                        status:peticion.status
                    };
                    alterminar(JSON.stringify(respuesta));
                }else{
                    var respuesta = JSON.parse(respuestaCruda);
                    alterminar(respuesta);
                }
            }catch(err){
                fondo.style.backgroundColor='orange';
                fondo.title=err+' '+respuestaCruda;
            }
      }
    }
    peticion.open('POST',parametros.url||'servidor.php',true);
    peticion.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    if(parametros.url){
        var str_par=[];
        for(var campo in parametros){
            if(campo!='url'){
                str_par.push(campo+'='+encodeURIComponent(parametros[campo]));
            }
        }
        peticion.send(str_par.join('&'));
    }else{
        peticion.send('todo='+JSON.stringify(parametros));
    }
}

function refrescar(){
    localStorage['taskcontrol-user']=document.getElementById('nombre_usuario').innerText;
    var boton=document.getElementById('boton_refrescar')||document.body;
    boton.style.backgroundColor='';
    enviar({accion:'listar_pendientes',
        destinatario:document.getElementById('nombre_usuario').innerText
    },function(respuesta){
        mensajes=respuesta.mensajes;
        poblar_tabla();
    },boton);
}

var ultimaColumnaQueOrdeno='';
var signo=1;

function ordenarPorColumna(){
    var columna=this.nombre_campo;
    if(ultimaColumnaQueOrdeno==columna){
        signo=-signo;
    }else{
        signo=1;
    }
    ultimaColumnaQueOrdeno=columna;
    mensajes.sort(function(a,b){
        var valora=a[columna];
        var valorb=b[columna];
        if(valora==valorb){
            return 0;
        }else if(valora<valorb){
            return signo;
        }else{
            return -signo;
        }
    });
    poblar_tabla();
}

function poblar_tabla(){
    var tabla=document.getElementById('tabla_mensajes');
    tabla.innerHTML='';
    var titulos=tabla.insertRow(-1);
    var td=titulos.insertCell(-1);
    td.className='botones_superiores';
    var img=document.createElement('img');
    img.src='cuadro-punteado.png';
    img.id='boton_marcar_todo';
    img.onclick=seleccionarTodo;
    td.appendChild(img);
    td=titulos.insertCell(-1);
    td.id='boton_refrescar';
    td.className='botones_superiores';
    img=document.createElement('img');
    img.src='loading.png';
    img.onclick=refrescar;
    td.appendChild(img);
    td=titulos.insertCell(-1);
    td.className='celda_vacia';
    td.colSpan=99;
    var titulos=tabla.insertRow(-1);
    for(var nombre_campo in campos){
        var def_campo=campos[nombre_campo];
        var td=titulos.insertCell(-1);
        var textoTitulo='titulo' in def_campo?def_campo.titulo:nombre_campo;
        td.innerText=textoTitulo;
        if(def_campo.colspan){
            td.colSpan=def_campo.colspan;
        }
        td.className='titulo';
        if(!textoTitulo){
            td.classList.add('celda_vacia');
        }else{
            td.className='titulo_ordenable';
        }
        td.nombre_campo=nombre_campo;
        td.onclick=ordenarPorColumna;
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
            if(def_campo.colspan){
                td.colSpan=def_campo.colspan;
            }
            if(def_campo.contentEditable){
                td.contentEditable=true;
            }
            (def_campo.mostrar||paraMostrar)(td,mensajes[i][nombre_campo],id);
            if(def_campo.linkear){
                td.linkear='https://mail.google.com/mail/u/0/?shva=1#inbox/'+mensajes[i].link
                td.onclick=function(){
                    window.open(this.linkear, '_blank');
                }
            }
        }
    }
}

function armar_pantalla_inicial(){
    var div=document.getElementById('resultados');
    var tabla=document.createElement('table');
    tabla.id='tabla_mensajes';
    div.appendChild(tabla);
    document.getElementById('nombre_usuario').innerText=localStorage['taskcontrol-user']||'SingIn';
    document.getElementById('nombre_usuario').onblur=refrescar;
    agregarleBoton(document.getElementById('seleccionados'),'Sí');
    agregarleBoton(document.getElementById('seleccionados'),'No');
    enviar({accion:'identificar'},function(respuesta){
        refrescar();
    });
}

window.addEventListener('load', armar_pantalla_inicial);