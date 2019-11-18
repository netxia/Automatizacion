/* Funciones     Logica Bot01
   Nombre        Descarga SII
   Document In   Bot01/In
   Document Out  Bot01/Out
   Autor         Gabriel Acevedo
   var $ = require("jquery");
*/

var XLSX = require('xlsx'); // convertir excel to json
var json2xls = require('json2xls'); //json to xls
const xml2js = require('xml2js');   // lector xml
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" }); //base del xml


//var evento = require('../eventos/event_conf');

module.exports.myObjLogic = function() {
    var objects = [];
    return {
        setDoc: async function(var_file) 
        {
          var t_data = await GetOperaciones(var_file);
          return t_data;

        },
        setConsolidado: async function(ruta_doc_base,ruta_doc_datos,  ruta_doc_in, ruta_doc_out, n_archivo, ruta_doc_hist) 
        {
          var t_json_hist = await Convert_excel_to_Json(ruta_doc_hist); 
          var t_json_datos = await GetConsolidado(ruta_doc_base , ruta_doc_in, ruta_doc_out);
          var t_data_Base =  await Convert_excel_to_Json(ruta_doc_datos);
          var Obj_day_file = await reform_to_archive_day(t_json_datos, t_data_Base, ruta_doc_out, n_archivo);
          var retorno_falg = await save_to_archive(Obj_day_file, t_json_hist , ruta_doc_out , n_archivo );
          return retorno_falg;

        }
}
}


async function GetOperaciones(var_file) {
    var objects = [];
    var obj_fin = await Convert_excel_to_Json(var_file);

    var v_ruta, v_Ruta_carpeta , v_Ruta_carpeta_dest, v_Ruta_Sharepoint = "";
    var conf = obj_fin[0];
    var user = obj_fin[1];


        for (i = 0; i < conf.length; i++) {
           
            if(conf[i].Parametro == "Ruta")
            {
                v_ruta = conf[i].Referencia;
  
            }
            if(conf[i].Parametro == "Ruta_carpeta")
            {
                v_Ruta_carpeta = conf[i].Referencia;
  
            }
            if(conf[i].Parametro == "Ruta_carpeta_dest")
            {
                v_Ruta_carpeta_dest = conf[i].Referencia;
  
            }
            if(conf[i].Parametro == "Ruta_Sharepoint")
            {
                v_Ruta_Sharepoint = conf[i].Referencia;
  
            }
        }


var date = new Date();
//restar dia
date.setDate(date.getDate() - 2 );

//var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
//var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
/*
var mes_d =  date.getMonth() + 2 ;
var F_ini = "01" + "" + mes_a + "" + date.getFullYear() ;
var F_fin = "01" + "" + mes_d + "" + date.getFullYear() ;
*/

var F_ini = addZero(date.getDate()) + "" + date.getMonth() + "" + date.getFullYear() ; 
var F_fin = F_ini ;

        for (i = 0; i < user.length; i++) {
            filas = {
               "RUTA"      : v_ruta + "",
               "Sociedad"  : user[i].Sociedad,
               "Sap"       : user[i].Sap,
               "RUT"       : user[i].RUT,
               "Clave"     : user[i].Clave ,
               "F_ini"     : F_ini ,
               "F_fin"     : F_fin ,
               "N_archivo" : user[i].Sap + ".xml" ,
               "Ruta_carpeta" : v_Ruta_carpeta,
               "Ruta_carpeta_dest" : v_Ruta_carpeta_dest,
               "Ruta_Sharepoint" : v_Ruta_Sharepoint

             };

           objects.push(filas);
        }
    return  objects;
    
}


async function GetConsolidado(ruta_doc_base , ruta_doc_in, ruta_doc_out) {

    var objects = [];
    
    var obj_fin = await Convert_excel_to_Json(ruta_doc_base);

        var user = obj_fin[1];

        for (i = 0; i < user.length; i++) {
 
            var sap = user[i].Sap;
            var ubicacion = ruta_doc_in + sap + ".xml";
            var t_data_result =  await Convert_xml_to_Json(ubicacion);


            var datos_sap = {
                "nombre"  : sap,
                "datos"   : t_data_result
              };

           

           objects.push(datos_sap);
        }
    return  objects;
    
}


function hoyFecha(){
    var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1;
        var yyyy = hoy.getFullYear();
        
        dd = addZero(dd);
        mm = addZero(mm);

        return dd+'/'+mm+'/'+yyyy;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}


async function  Convert_excel_to_Json(var_file)
{
    var obj_fin = [];
    var workbook = XLSX.readFile(var_file);
    var sheet_name_list = workbook.SheetNames;
     sheet_name_list.forEach( async function(y) {
        var nombretab = y;
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        data.shift();
        data.shift();
        console.log(data);

        obj_fin.push(data);
    });

    return obj_fin;

}

async function  Convert_xml_to_Json(ubicacion)
{
    var obj_fin = "";
    let xml_string = fs.readFileSync(ubicacion , "utf8");

   await parser.parseString(xml_string, async function(error, result) {
        if(error === null) {
            console.log(result);
            obj_fin = result;
        }
        else {
            console.log(error);
            obj_fin = error;
        }
    });
    return  obj_fin;
}




async function  reform_to_archive_day(t_json_datos, t_data_Base, ruta_doc_out, n_archivo)
{
   // var flag = false;

    var Master_1 = t_data_Base[0];
    var Master_2 = t_data_Base[1];

      var jsonData = [];
      for (i = 0; i < t_json_datos.length; i++) {

        var nombre_obj    = t_json_datos[i].nombre;
        var obj_obj_Dcon  = t_json_datos[i].datos['SII:RESPUESTA']['SII:RESP_BODY'][0]['DATOS_CONSULTA'];
        var obj_obj_body  = t_json_datos[i].datos['SII:RESPUESTA']['SII:RESP_BODY'][0]['CESION'];
        var obj_obj_hdr   = t_json_datos[i].datos['SII:RESPUESTA']['SII:RESP_HDR'];

        if(obj_obj_body != null || obj_obj_body != undefined )
        {
            var identificador = obj_obj_Dcon[0].RUT;
            for (ix = 0; ix < obj_obj_body.length; ix++) {

                  

                  var var_Cl              = await val_dato(obj_obj_body[ix].TIPO_DOC);
                  var var_rut_deudor      = identificador; 
                  var var_RUT_Emisor      = await val_dato(obj_obj_body[ix].VENDEDOR);
                  var var_ID_rut_emisor   = ""; 
                  var var_EMISOR          =  await val_dato(obj_obj_body[ix].RZ_CEDENTE); 
                  
                  var var_RUT_Cedente     = await val_dato(obj_obj_body[ix].CEDENTE); 	
                  var var_ID_rut_cedente  = ""; 
                  var var_CEDENTE         = await val_dato(obj_obj_body[ix].RZ_CEDENTE) ; 
                  
                  var RUT_Cesionario      =  await val_dato(obj_obj_body[ix].CESIONARIO);
                  var ID_cesionario       = ""; 	
                  var var_CESIONARIO      = await val_dato(obj_obj_body[ix].RZ_CESIONARIO); 
                  
                  var Fecha_Cesion        =  await val_dato(obj_obj_body[ix].FCH_CESION); 
                  var Monto_Cesion        = await val_dato(obj_obj_body[ix].MNT_CESION); 	
                  var Tipo_Doc            = await val_dato(obj_obj_body[ix].NOMBRE_DOC); 
                  var Folio               = await val_dato(obj_obj_body[ix].FOLIO_DOC); 	
                  var Fecha_Emision       = await val_dato(obj_obj_body[ix].FCH_EMIS_DTE); 	
                  var Monto_Documento     = await val_dato(obj_obj_body[ix].MNT_TOTAL); 
                  var Fecha_Carga         = await val_dato(obj_obj_Dcon[0].HASTA_DDMMAAAA);

                 // var Fecha_Carga         = v_Fecha_Carga.substring(4,8) + "-" + v_Fecha_Carga.substring(2,8)  + "-" + v_Fecha_Carga.substring();
                  

                  var traeDatos = Master_1.find(obj_1 => obj_1['Nº ident.fis.1'] == identificador );

                  if(traeDatos != undefined  || traeDatos != null  )
                  { 
                   if(var_RUT_Emisor == "")
                   {
                       var_RUT_Emisor =  await val_dato(traeDatos['Nº ident.fis.1'])
                   }

                   // sabemos que viene vacio desde la data
                   var_ID_rut_emisor =  await val_dato(traeDatos.Proveedor);

                   ID_cesionario =  await val_dato(traeDatos.Cliente);
                   //var_ID_rut_cedente = await val_dato(traeDatos[0].Proveedor);
            

                  }
                 



                var json_d = {
                    'CL'           : var_Cl  ,
                    'RUT Deudor'   : var_rut_deudor,

                    'RUT Emisor'   : var_RUT_Emisor,
                    'ID_EMISOR'    : var_ID_rut_emisor,
                    'EMISOR'       : var_EMISOR,

                    'RUT Cedente'  : var_RUT_Cedente,
                    'ID_CEDE'      : var_ID_rut_emisor,
                    'CEDENTE'      : var_CEDENTE,
                    
                    'RUT Cesionario'  : RUT_Cesionario,
                    'ID_CESIONARIO'   : ID_cesionario,
                    'CESIONARIO'      : var_CESIONARIO,

                    'Fecha Cesión'    :  Fecha_Cesion,
                    'Monto Cesión'    : Monto_Cesion,

                    'Tipo Doc'        : Tipo_Doc, // NOMBRE_DOC

                    'Folio'           : Folio, 

                    'Fecha Emisión'   :  Fecha_Emision,
                    'Monto Documento' : Monto_Documento,
                    'Fecha Carga'     : Fecha_Carga
                }
        
               jsonData.push(json_d);
    
            }
            
        }

       


      

      }



  /*  try
    {
        await save_json_to_excel(jsonData, ruta_doc_out, n_archivo);
        flag = true;
    }
    catch
    {
        flag = false;
    }
    return flag;
    */
  // await save_json_to_excel(jsonData, ruta_doc_out, n_archivo); 
   return jsonData;

}




async function  save_to_archive(Obj_day_file, t_json_hist , ruta_doc_out , n_archivo )
{
    var flag = false;
    try
    {

        var jsonData = [];

        for (i = 0; i < Obj_day_file.length; i++) {

            var folio_dia = Obj_day_file[i]['Folio']; 
            var fecha_dia = Obj_day_file[i]['Fecha Carga']; 

            var traeDatos = t_json_hist[0].find(obj_1 => obj_1['Folio'] == folio_dia  
                                                &&   obj_1['Fecha Carga'] == fecha_dia     );
       
            if(traeDatos != null || traeDatos != undefined )
            {
                jsonData.push(traeDatos);
                
            }
            else
            {
                jsonData.push(Obj_day_file[i]);
               
            }
        }

       // jsonData.sortBy(function(o){ return new Date( o['Fecha Carga'] ) });

        await save_json_to_excel(jsonData, ruta_doc_out, n_archivo);
        flag = true;
    }
    catch
    {
        flag = false;
    }
    return flag;
    


}


async function val_dato(var_dato)
{
    if(val_dato == null ||  val_dato == '' || val_dato == undefined  )
    {
        var_dato == "";
    }
    return var_dato;

}

async function  save_json_to_excel(t_json_datos, ruta_doc_out, n_archivo)
{
    var flag = false;
    var ruta_final = ruta_doc_out + n_archivo;
  /*  var json = {
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    }
    */
    try
    {
        var xls = json2xls(t_json_datos);
        fs.writeFileSync(ruta_final, xls, 'binary');
        flag = true;
    }
    catch
    {
        flag = false;
    }
    return flag;

}









/*
async function  genrateJSONEngine() {

    var jsonData = [];

    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('Datos/Bot01/Configuracion.xlsx');
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function (y) {
      var array = workbook.Sheets[y];

      var first = array[0]
      var headers = first.split(',');

      var jsonData = [];
      for (var i = 1, length = array.length; i < length; i++) {

        var myRow = array[i]
        var row = myRow.split(',');

       
        for (var x = 0; x < row.length; x++) {
          data[headers[x]] = row[x];
        }
       jsonData.push(data);

      }
    });

    return jsonData;

}
*/









