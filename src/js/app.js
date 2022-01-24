let pagina = 1;
const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", function(){
    iniciarApp();
})

function iniciarApp(){
    mostrarServicios();
    //Resalta el div actual segun el tab al que se presiona
    mostrarSeccion();
    //Oculta o muestra una sección según el tab que se presiona
    cambiarSeccion();
    //Paginacion anterior y siguiente
    paginaAnterior();
    paginaSiguiente();

    //Comprueba la página actual para ocultar o mostrar la paginación
    botonesPaginador();

    //Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validación)
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //Desahbilita fechas pasadas
    deshabilitarFechaAnterior()

    //Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion(){
    
    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector(".mostrar-seccion")
    if (seccionAnterior){
        seccionAnterior.classList.remove("mostrar-seccion");
    }   

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add("mostrar-seccion")
    
    //Elimina la clase de actual en el tab anterior
    const tabAnterior = document.querySelector(".actual")    
    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }
    

    //Resalta el Tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add("actual")    
    
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button");
    enlaces.forEach(function(enlace){
        enlace.addEventListener("click",e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            
            //Ocultar la seccion previa
            document.querySelector(".mostrar-seccion").classList.remove("mostrar-seccion");
            document.querySelector(".actual").classList.remove("actual");
            
            //Agrega mostrar seccion donde dimos click
            // const seccion = document.querySelector(`#paso-${pagina}`)
            // seccion.classList.add("mostrar-seccion");
            // //Agrega la clase actual a la seccion seleccinada
            // const actual = document.querySelector(`[data-paso="${pagina}"]`)
            // actual.classList.add("actual")   
            
            mostrarSeccion();
            botonesPaginador();
        })
    })
}
    
        
async function mostrarServicios(){
    try {
        const url = "http://localhost:3000/servicios.php";

        const conexion = await fetch(url);
        const db = await conexion.json();        

        console.log(db);

        //const {servicios} = db;

        db.forEach(element => {
            const {id, nombre, precio} = element;
            console.log(element.nombre)
            //DOM SCRIPTING
            //Generar nombre de servicio
            const nombreServicio = document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio")
            

            //Generar precio de servicio
            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");
            

            //Generar DIV contenedor
            const servicioDiv = document.createElement("DIV");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;            

            //Inyectar precio y nombre al DIV de servicio
            servicioDiv.appendChild(nombreServicio)
            servicioDiv.appendChild(precioServicio)
            
            //Inyectar al HTML
            document.querySelector("#servicios").appendChild(servicioDiv)

        });

        
    } catch (error) {
        console.log(error)
    }

    
}
function seleccionarServicio(e){
    //Forzar que el elemento al cual le dimos click sea el div
    let elemento;
    if (e.target.tagName === "P"){
        elemento = e.target.parentElement;

    }else{
        elemento = e.target;
    }
    if(elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add("seleccionado")        
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre:elemento.firstElementChild.textContent,
            precio:elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj);
    }   
}

function eliminarServicio(id){    
    const {servicios} = cita;    
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
    console.log(cita)

}

function agregarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj]    
    console.log(cita)
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector("#anterior")
    paginaAnterior.addEventListener("click", ()=>{
        pagina--;        
        botonesPaginador()
    })
    
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente")
    paginaSiguiente.addEventListener("click", ()=>{
        pagina++;        
        botonesPaginador()
    })    
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector("#anterior")
    const paginaSiguiente = document.querySelector("#siguiente")

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar")
    }
    // else if(pagina === 2){
    //     paginaAnterior.classList.remove("ocultar")
    //     paginaSiguiente.classList.remove("ocultar")
    // }
    else if(pagina === 3){
        paginaSiguiente.classList.add("ocultar")
        paginaAnterior.classList.remove("ocultar")
        mostrarResumen()
    }
    else{
        paginaAnterior.classList.remove("ocultar")
        paginaSiguiente.classList.remove("ocultar")
    }
    mostrarSeccion()
}

function mostrarResumen(){
    //Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //Seleccionar el resumen
    const validarServicios = document.querySelector("#paso-3");
    //Limpia el HTML previo
    //validarServicios.innerHTML = "";
    while(validarServicios.firstChild){
        validarServicios.removeChild(validarServicios.firstChild)
    }

    if(Object.values(cita).includes("")){
        const noServicios = document.createElement("P")
        noServicios.textContent = "Faltan datos de Servicios, hora, fecha o nombre"
        
        noServicios.classList.add("invalidar-cita");
        validarServicios.appendChild(noServicios);
        return
    }

    //Mostrar el resumen
    const headingCita = document.createElement("H3")
    headingCita.textContent = "Resumen de Cita"

    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`
    
    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora: </span> ${hora}`

    const serviciosCita = document.createElement("DIV")
    serviciosCita.classList.add("resumen-servicios")

    const headingServicios = document.createElement("H3")
    headingServicios.textContent = "Resumen de Servicios"
    serviciosCita.appendChild(headingServicios)
    let cantidad =0;
    //Iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;
        
        const contenedorServicio = document.createElement("P")
        contenedorServicio.classList.add("contenedor-servicio")

        const textoServicio = document.createElement("P")
        textoServicio.textContent = nombre

        const precioServicio = document.createElement("P")
        precioServicio.textContent = precio
        precioServicio.classList.add("precio")

        const totalPagar = precio.split("$")
        
        console.log(parseInt(totalPagar[1].trim()))
        
        cantidad += parseInt(totalPagar[1].trim());
        

        //Colocar texto y precio en el DIV
        contenedorServicio.appendChild(textoServicio)
        contenedorServicio.appendChild(precioServicio)
        serviciosCita.appendChild(contenedorServicio)
        
    })   
    
    validarServicios.appendChild(headingCita)
    validarServicios.appendChild(nombreCita)
    validarServicios.appendChild(fechaCita)
    validarServicios.appendChild(horaCita)  

    validarServicios.appendChild(serviciosCita)

    const cantidadPagar = document.createElement("P");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`; 
    
    
    validarServicios.appendChild(cantidadPagar)
}

function nombreCita(){
    const nombreInput = document.querySelector("#nombre")
    nombreInput.addEventListener("input", e =>{
        const nombreTexto = e.target.value.trim(); //Trim elimina los espacios en blanco
        if(nombreTexto === "" || nombreTexto.length <3){
            mostrarAlerta("Nombre no válido", "error")
        }else{
            const alerta = document.querySelector(".alerta")
            if(alerta){
                alerta.remove()
            }
            cita.nombre = nombreTexto;            
        }        
    })
}

function mostrarAlerta(mensaje, tipo){    

    //Si hay una alerta no crear otra
    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia){
        //alertaPrevia.remove();
        return
    }
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta")

    if(tipo === "error"){
        alerta.classList.add("error")
    }

    //Insertar en el HTML
    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta)

    //Eliminar la alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove()
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector("#fecha")
    fechaInput.addEventListener("input", e =>{
        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
            e.preventDefault()
            fechaInput.value = ""
            mostrarAlerta("Fines de semana no atendemos","error")
        }
        else{
            cita.fecha = fechaInput.value;            
        }     


    })
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector("#fecha")
    const fechaAhora = new Date()
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth()+1;
    const dia = fechaAhora.getDate();

    //Formato deseado: AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
    
}

function horaCita(){
    const inputHora = document.querySelector("#hora")
    inputHora.addEventListener("input", e =>{
        const horaCita = e.target.value;
        const hora = horaCita.split(":")            //Divide un string en los dos puntos elegidos de la hora
        if(hora[0] < 9 || hora[0] > 18){
            mostrarAlerta("Hora no válida","error")
            setTimeout(() => {
                inputHora.value = ""    
            }, 3000);
            
        }else{
            cita.hora = horaCita
            
        }       
        
    })
}