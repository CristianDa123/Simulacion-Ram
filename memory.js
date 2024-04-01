// Función para solicitar al usuario el número de particiones de la memoria RAM
function solicitarParticiones() {
    var particiones = prompt("Ingrese el número de particiones de la memoria RAM (hasta 50):");
    if (particiones !== null && !isNaN(particiones)) {
        particiones = parseInt(particiones);
        if (particiones > 0 && particiones <= 50) { 
            crearSimulacion(particiones);
        } else {
            alert("Error: Ingrese un número válido entre 1 y 50 para las particiones."); // Se actualizó el mensaje de error
        }
    } else {
        alert("Error: Ingrese un número válido para las particiones.");
    }
}

// Función para crear la simulación visual de la memoria RAM

var ramAsignada = []; 

function crearSimulacion(particiones) {
    var memoryDiv = document.getElementById("memory");
    memoryDiv.innerHTML = ""; 

    ramAsignada = new Array(particiones).fill(0); 

    for (var i = 0; i < particiones; i++) {
        var partitionDiv = document.createElement("div");
        partitionDiv.className = "partition";
      
        partitionDiv.dataset.partitionIndex = i;
        memoryDiv.appendChild(partitionDiv);
    }
}


var totalRAM_MB = 0;

// Función para solicitar al usuario la cantidad que desea guardar en la memoria RAM
function actualizarParticion(particionIndex) {
    var partitionDiv = document.querySelector(".partition[data-partition-index='" + particionIndex + "']");
    partitionDiv.textContent = ramAsignada[particionIndex] + " MB";
}

// Función para solicitar al usuario la cantidad que desea guardar en la memoria RAM
function solicitarCantidad() {
    var cantidadRAM = prompt("Ingrese la cantidad de RAM en megabytes (MB):");
    if (cantidadRAM !== null && !isNaN(cantidadRAM)) {
        cantidadRAM = parseInt(cantidadRAM);
        if (cantidadRAM > 0) {
            var totalAsignado = ramAsignada.reduce((a, b) => a + b, 0); 
            var ramDisponible = 8192 - totalAsignado; 

            if (cantidadRAM <= ramDisponible) {
                var particionIndex = ramAsignada.findIndex(ram => ram === 0);
                if (particionIndex !== -1) {
                    ramAsignada[particionIndex] = cantidadRAM;
                    actualizarParticion(particionIndex);
                } else {
                    alert("Error: No hay particiones disponibles para asignar RAM.");
                }
            } else {
                alert("La cantidad de RAM solicitada excede la capacidad disponible (8 GB).");
                if (totalAsignado + cantidadRAM > 8192) { 
                    alert("Por favor, borre cantidad de memoria RAM o la PC se reiniciará.");
                }
            }

            // Actualizar el texto del botón "Guardar en memoria RAM" con la cantidad total asignada
            totalAsignado = ramAsignada.reduce((a, b) => a + b, 0); 
            var gb = Math.floor(totalAsignado / 1024); 
            var mb = totalAsignado % 1024; 
            var cantidadMostrar = gb > 0 ? gb + " GB" : ""; 
            cantidadMostrar += mb > 0 ? (gb > 0 ? " y " : "") + mb + " MB" : ""; 
            document.getElementById("btnGuardar").textContent = "Guardar en memoria RAM " + cantidadMostrar;
        } else {
            alert("Por favor, ingrese una cantidad válida de RAM.");
        }
    } else {
        alert("Por favor, ingrese un número válido para la cantidad de RAM.");
    }
}
window.onload = solicitarParticiones;

// Función para eliminar la RAM de una partición
function eliminarRAMParticion(particionIndex) {
    
    ramAsignada[particionIndex] = 0;
    
    actualizarParticion(particionIndex);
}

var eliminarParticionActivo = false; 

function eliminarParticion() {
    eliminarParticionActivo = !eliminarParticionActivo;
    if (eliminarParticionActivo) {
        alert("Modo de selección de partición activado. Haz clic en la partición de la cual deseas eliminar la RAM.");
        activarModoEliminarParticion(); 
    } else {
        alert("Modo de selección de partición desactivado.");
    }
}

function activarModoEliminarParticion() {
    var particiones = document.querySelectorAll('.partition');
    particiones.forEach(function(particion, index) {
        particion.addEventListener('click', function() {
            if (eliminarParticionActivo) {
                var confirmar = confirm("¿Estás seguro de que deseas eliminar la cantidad de RAM de esta partición?");
                if (confirmar) {
                    eliminarRAMParticion(index); 
                    eliminarParticionActivo = false; 
                }
            }
        });
    });
}
