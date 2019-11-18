
const express = require('express');
var logic_Bot01 = require('./Logic/logic_Bot01');
const app = express();

const port = process.env.PORT || 3000;

//const server = app.listen(port);

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

//server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});
/****************************************************** */
/*********************BOT 01*************************** */
/****************************************************** */
app.get('/api/Bot01_LoadData',async function (req, res)  {
  var ruta_doc = 'Datos/Bot01/Configuracion.xlsx';
  var resultado = await logic_Bot01.myObjLogic().setDoc(ruta_doc);
  res.send(JSON.stringify({ "value" : resultado   }));
});

app.get('/api/Bot01_Gesconsolidado',async function (req, res)  {

  var date = new Date();
  var ano =  date.getFullYear() ;
  var ruta_doc_base = 'Datos/Bot01/Configuracion.xlsx';
  var ruta_doc_datos = 'Datos/Bot01/Datos Maestros Proveedores.xlsx';
  var ruta_doc_hist = 'Datos/Bot01/Out/Cesiones Factoring ' + ano + '.xlsx' ;
  var ruta_doc_in = 'Datos/Bot01/In/';
  var ruta_doc_out = 'Datos/Bot01/Out/';
  var n_archivo = 'Cesiones Factoring ' + ano + '.xlsx';
  var resultado = await logic_Bot01.myObjLogic().setConsolidado(ruta_doc_base, ruta_doc_datos, ruta_doc_in, ruta_doc_out, n_archivo , ruta_doc_hist);
  res.send(JSON.stringify({ "value" : resultado   }));
});

/****************************************************** */
/****************************************************** */
/****************************************************** */
app.get('/api/endpoint2', (req, res) => {
    // Set Content-Type differently for this particular API
    res.set({'Content-Type': 'application/xml'});
    res.send(`<note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
        </note>`);
});



/*var express = require('express');
var logic_Bot01 = require('./Logic/logic_Bot01');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/nacimiento', async function (req, res) {
 
var resultado = await logic_Bot01.myObjLogic().setDoc();

    req.res = {
      status: 200, 
      body: { resultado  
            },
            headers: {
              'Content-Type': 'application/json'
          }
    };
});


res.status(200).send({
  resultado: resultado
});



res.send(resultado);
 
});

}
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

*/
