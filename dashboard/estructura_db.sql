create table mensajes(
    id             bigint NOT NULL AUTO_INCREMENT primary key,
    remitente      varchar(500),
    destinatario   varchar(500),
    emitido        datetime,
    asunto         varchar(1000),
    vencimiento    date,
    rapida         varchar(500), 
    respuesta      varchar(500),
    link           varchar(500),
    respondido     datetime,
    ocultado       datetime
);

insert into mensajes(remitente, destinatario, emitido, asunto, vencimiento) values
   ('pedro.paramo@gmail.com', 'emilioplatzer@gmail.com', '2013-11-10', 'Preparar el informe de resultados 3Q2013', '2013-11-15');
insert into mensajes(remitente, destinatario, emitido, asunto, vencimiento) values
   ('ricardoceci@gmail.com', 'emilioplatzer@gmail.com', '2013-11-10', 'Éxito en la etapa de testing del BackEnd', '2013-11-15'),
   ('ricardoceci@gmail.com', 'emilioplatzer@gmail.com', '2013-11-10', 'Éxito en la etapa de testing del FrontEnd', '2013-11-15');
insert into mensajes(remitente, destinatario, emitido, asunto, vencimiento) values
   ('pedro.paramo@gmail.com', 'emilioplatzer@gmail.com', '2013-11-10', 'Reunión semestral (confirmar asistencia)', '2013-11-15');
