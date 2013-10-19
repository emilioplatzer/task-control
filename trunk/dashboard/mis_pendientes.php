<!doctype html>
<html>
<head>
<link rel="stylesheet" href="css/mis_pendientes.css" type="text/css">
</head>
<table id=encabezado><tr><td>
    <img id=logo src=logo-hi-res.png>
<td style="text-align:right; vertical-align:bottom"><table>
    <tr><td style=text-align:right><input id=user><input id=pass type=password><input id=boton_login value='Sing In' type=button>
    <tr><td style=height:40px>
    <tr><td style=text-align:right><img src=google-bar.png>
    <tr><td id=frase_titulo style=text-align:right>Tareas pendientes por responder <span id=nombre_usuario contenteditable>ingresar G+</span>
    </table>
<tr style="height:4px; padding:0px; margin:0px;"><td style='font-size:1px; background-color:#EC0000; height:4px; padding:0px; margin:0px; text-align:right' colspan=2><img src=rayita.png style=" padding:0px; margin:0px;"></td></tr>
</table>
<div id=resultados></div>
<div id=seleccionados>Se seleccionaron <span id=cuantos_seleccionados></span> mensajes. Respuestas grupales: </div>
<script src="js/mis_pendientes.js"></script>
</html>