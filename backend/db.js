const mysql = require("mysql2");

//Configuración de la conexión a Mysql
const conexion = mysql.createConnection({
    host: "localhost",  //servidor local
    user: "root",       //Usuario de MySQL (Por defecto en XAMPP)
    database: "tienda"  //Nombre de nuestra BD
}) 

// Comproba si la conexión es exitosa

conexion.connect((error)=>{
    if (error) {
        console.error("Error al conectar con MySQL: ", error);
        return;
    }
    console.log("Conexión exitosa con MySQL");
})

//Exportar la conexión para reutilizarla en las rutas del servidor
module.exports = conexion;