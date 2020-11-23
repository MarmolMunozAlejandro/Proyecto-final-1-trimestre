
db.productos.find({producto:"Caracoles"}).pretty()
//Muestra el producto Caracoles


db.productos.find({$and:[
    {categoria:{$in:
        ["Chacina","Carne"]}},
    {"cantidad.num":{$gte:15}}, 
    {"cantidad.unid":"kg"}
]}).pretty()
// Muestra los productos cárnicos cuya cantidad en el almacén sea superior a 15kg.


db.productos.find({preciovp:{$lt:10}}).pretty()
//  Muestra todos los productos baratos cuyo precio de venta al público sea inferior a 10$.


db.productos.find({$and:[
    {$or:[ 
      {"cantidad.unid":"bandejas"},
      {"cantidad.unid":"paquetes"},
    ]},
    {"cantidad.num":{$gt:10}}
]}).pretty()
//Muestra los productos almacenados en bandejas y paquetes con una cantidad superior a 10

db.productos.find({$and:[
    {proveedor:{$ne:"Hispasur"}},
    {categoria:{$nin:
        ["Carne","Chacina"]}},
    {"preciovp":{$lte:10}},
    {"preciovp":{$gt:5}}
]}).pretty()
// Muestra los productos que no procedan del provedor Hispasur ni sean cárnicos, así como que su precio de venta oscile entre 5$ y 10$


db.productos.find( {$and:[
    {producto:{$not:{$regex: /^Chicharron/i}}},
    {categoria:{$nin:["Tarta"]}},
    {proveedor:{$in:
        ["Frito-Lay","Angel Lopez","Marclem"]}}
]}).pretty()
// Muestra los productos que no sean ni chicharrones ni tartas y que sean de tres proveedores en concreto


db.productos.find({oferta:
    {$exists: true}
}).pretty()
// Muestra los productos que tengan ofertas

db.productos.find({oferta:{$all: 
    ["3x2", "2x1"] 
}}).pretty()
// Muestra los productos que tengan dos ofertas en concreto


db.productos.find({$and:[
    {oferta:{$in:["11x9", "12x10", "6x5"]}},
    {$nor:[
        {oferta:{$size:1}},
        {oferta:{$size:0}}
    ]}
]}).pretty()
// Muestra los productos que tengan 2 o más ofertas entre las que debe haber al menos una oferta de entre tres elegidas.
// $size no puede ir acompañado de operadores, ergo no se admite $size:{$gte:2}, la única forma es con nor.

db.productos.find({$or:[
    {$and:[
        {producto:{$not:{$regex: /pollo/i}}},
        {$nor:[
            {categoria:{$eq:"Molusco"}},
            {categoria:{$eq:"Aperitivo"}},
        ]}
    ]},
    {proveedor:{$in:["Hispasur","Angel Lopez"]}},
]}).pretty()
// Muestra todos los productos pero los aperitivos, los moluscos y los que estén hecho de pollo deben ser de dos proveedores en concreto
    
db.productos.aggregate([
        {$project: {beneficio:
        {$subtract:["$preciovp", "$precio"]}}}
]).pretty()
// Muestra los beneficios que obtiene la empresa por cada uno de sus productos.    


db.productos.aggregate([{$match: {producto: "Chorizo rosario"}},
    {$project: {beneficio:
    {$subtract:["$preciovp", "$precio"]}}}
]).pretty()
//Muestra el beneficio que obtiene la empresa vendiendo un producto en concreto.


db.productos.aggregate([
    {$match:{$and:[
        {producto:{$not:{$regex: /pollo/i}}},
        {"cantidad.num":{$gt:10}}
    ]}},
    {$project: {valor:
    {$multiply:["$cantidad.num", "$precio"]}}}
]).pretty()
// Muestra el dinero gastado en función de los productos en el almacén de aquellos cuya cantidad supere las 10 unidades y que no sean de pollo.

   
db.pedidos.aggregate([
    {$project: {tardanza:
        {$divide:[{
    $subtract:["$fechaEntrega", "$fechaPedido"]},
   86400000]}}}
]).pretty()
// Muestra los días que se ha tardado en entregar los pedidos. La resta de fecha da un resultado en milisegundos, ergo hay que dividirlo 
// para pasarlo a días.


db.pedidos.find({
    precio:{$gte:50},
    retraso:true
}).pretty()
// Muestra los pedidos con un cobro superior a 50 que hayan llegado con retraso.
    

db.pedidos.find( {$and:[
    {producto:{$regex: /^Cheetos/i}},
    {retraso:false}
]}).pretty()
// Muestra los pedidos de Cheetos que no hayan sido enviados con retraso.


db.pedidos.find( {$or:[
    {$and:[
        {$or:[
            {precio:{$gt:100}},
            {precio:{$lt:50}},
        ]},
        {retraso: true},
    ]},
    {$and:[
        {cantidad:{$gte:10}},
        {retraso: true},
        {producto:{$ne:"Loncha chorizo"}},
    ]}
]}).pretty()
// Muestra los pedidos que no valgan entre 50 y 100 o aquellos cuya cantidad sea 10 o superior (a excepción de un producto), 
// que hayan sido entregados con retraso.


db.pedidos.find({$or:[
    {$and:[
        {localidad:{$in:["Arahal","Sevilla"]}},
        {precio:{$gt:20}},
        {cantidad:{$gte:5}},
        {retraso: false},
    ]},
    {$and:[
        {localidad:{$nin:["Arahal","Sevilla"]}},
        {"fechaEntrega":{"$gte": new Date("2019,01,01")}},
        {$nor:[
            {producto:{$regex: /^Chistorras/i}},
            {producto:{$regex: /^Chicharrones/i}},
            {retraso: true}
        ]}
    ]}
]}).pretty()
// Muestra los pedidos realizados en Arahal y Sevilla cuya cantidad supere las 5 unidades y un precio de 20, o los realizados en el resto de 
// municipios después del 2018 que no sean ni chistorras ni chicharrones, ambas opciones realizadas sin retraso.


db.pedidos.find({$or:[
    {$and:[
        {localidad:{$eq: "Moron"}},
        {"fechaEntrega":{"$gte": new Date("2018,01,01")}},
        {"fechaEntrega":{"$lte": new Date("2019,12,31")}},
        {producto:{$eq: "Caracoles"}},
        {cantidad:{$gt:10}},
        {retraso: false},
    ]},
    {$and:[
        {retraso: true},
        {cantidad:{$lte:10}},
        {producto:{$eq: "Cabrillas"}},
        {"fechaEntrega":{"$lt": new Date("2018,01,01")}},
        {localidad:{$eq: "Arahal"}},
    ]}
]}).pretty()
// Muestra los pedidos de más de 10 cubos de caracoles realilzados en 2018 y 2019 sin retraso en la localidad de Morón, O los pedidos
// de 10 o menos cubos de cabrillas realizados con retraso en la localidad de Arahal