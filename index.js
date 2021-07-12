const express = require('express');
const multer = require('multer');
const fs = require('fs');

// Lista de URLS de archivos recientes
urls = []

// Instanaci de aplicacion
const app = express();

// CARGAR CONFIGURACION DE VARIABLES DE ENTORNO
require('dotenv').config();

// Obetner puerto de señalado por variable de entorno
const port = process.env.PORT; 

// IMPORTAR HELPERS
const ficheros = require('./helpers/ficheros');
const path = require('path');

// Uso de archivos estatics o de produccion generados con react
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {                                                                 
    res.header("Access-Control-Allow-Origin", "*");                                        
    res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS");     
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, multipart/form-data");    
    res.header("Access-Control-Allow-Credentials", true);              
    next();        
}); 

// Configuracion del storage de multer, para almacenar los archivos enviados por el servicio
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './assets');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

// definir upload de archivos con configuracion storage
const upload = multer({storage: storage});

// Endpoint donde se reciben los archivos enviados por el servicio
app.post('/files', ficheros, upload.single('File'), async (req, res)=> {
    console.log("Archivo recibido: " + req.file.path);
    urls.push(req.file.path)
    res.status(200).send();
});

app.use(express.json({limit: '50mb'}));
app.use(express.static(__dirname + '/assets'));

// Endpoint para obtencion de archivos existentes/recientes
app.get('/geturlFiles', async (req, res)=> {

    if(urls.length === 0){
        res.status(400).send('No existen archivos en estos instantes')
    }else{
        res.send({
            Files: urls
        })
    }

});

// Obtener archivo deseado
app.post('/descargar', async (req, res) =>{

    console.log(req.body.url,  req.body.url.substring(7, 
        req.body.url.length))

    res.download(__dirname + '/' + req.body.url, req.body.url.substring(7, 
        req.body.url.length), (err) =>{
            if(err){
                console.log(err);
            }else{
                console.log("descarga realizada con exito");
            }
        })
    
    // let fd = fs.createReadStream(path.join(__dirname, 'assets', req.body.url.substring(7, 
    //     req.body.url.length)));
    
    // fd.on('error', e =>{
    //     if(e.code == 'ENOENT'){
    //         return res.status(404).end();
    //     }

    //     res.status(500).send();
    // })

    // res.setHeader("Content-Type", "text/txt");
    // res.setHeader("Content-Disposition", "attachment", `filename=${req.body.url.substring(7, 
    //     req.body.url.length)}`);
    // fd.pipe(res);

});

// Activar servidor
app.listen(port, () =>{
    console.log("Servidor corriendo en el puerto: " + port);
    console.log("--> A la escucha y obtencion de archivos de texto <--");
});