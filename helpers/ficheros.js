const fs = require('fs');
const assets = './assets'

/*
    Este middleware se encarga de verificar en cada
    peticion si la carpeta assets existe. de no existir
    la crea y continua con la peticion
*/
const compFicheros = (req, res, next) => {

    if (fs.existsSync(assets)) {
        // SI el directorio ya existe continua con la peticion
        next();
    } else {

        // Crear carpeta assets
        fs.mkdir(assets, (error) => {
            if (error) {
                console.log("Error al crear fichero assets: " + error);
            }else{
                console.log("Fichero creado");
            }
        })
        next();
    }

}

module.exports = compFicheros;