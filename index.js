const express = require('express');
const multer = require('multer');

// Instanaci de aplicacion
const app = express();

// CARGAR CONFIGURACION DE VARIABLES DE ENTORNO
require('dotenv').config();

// Obetner puerto de señalado por variable de entorno
const port = process.env.PORT; 

// IMPORTAR HELPERS
const ficheros = require('./helpers/ficheros')

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
    res.status(200).send();
});

// Activar servidor
app.listen(port, () =>{
    console.log("Servidor corriendo en el puerto: " + port);
    console.log("--> A la escucha y obtencion de archivos de texto <--");
});