<?php

function obtenerServicios () : array{
    try {
        //Importar una conexión
        require "database.php";
        //var_dump($db);
        
        //Escribir el código SQL
        $db->set_charset("utf8");
        $sql = "SELECT * FROM servicios;";
        $consulta = mysqli_query($db, $sql);
        
        //Arreglo vacio
        $servicios = [];

        //Obtener los resultados
        while($row = mysqli_fetch_assoc($consulta)){
            $servicios[] = $row;
        }
        return $servicios;
        
        
    }catch(\Throwable $th){
        var_dump($th);
    }

}

obtenerServicios();