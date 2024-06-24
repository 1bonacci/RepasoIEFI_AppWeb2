import { join,parse } from "node:path";
import{readFile, writeFile} from "node:fs";


const ruta = join('./api/v1/productos.json')

//GET
const GetTraerJson = (respuesta)=>{
    readFile(ruta,(err,datos)=>{
        if (err) {
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8',
                'access-control-allow-origin':'*'
            }
            )
            respuesta.end('Recurso no encontrado')
        }
        else{
            respuesta.writeHead(200,{
                'Content-Type':'application/json;charset=utf-8',
                'access-control-allow-origin':'*'
            })
            respuesta.end(datos)
        }
    })
}

//GET ID
const GetTraerID = (peticion,respuesta) =>{
    readFile(ruta, (err,datos)=>{
        if (err) {
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8',
                'access-control-allow-origin':'*'
            })
            respuesta.end('Recurso no encontrado')
        }
        else{
            const id = parse(peticion.url).base  //Obtenemos el ID

            const objetoJSON = JSON.parse(datos) //Pasamos los datos con formato JSON a un objeto JS

            const arrayProductos = objetoJSON.productos //Obtenemos el arreglo de los productos del JSON

            const producto = arrayProductos.find((elemento)=>{return parseInt(elemento.id) === parseInt(id)}); //Condicion, FIND 1 solo elemento

            if (producto) {
                const productoJSON = JSON.stringify(producto); //Reconvierto el objeto a JSON

                //Armar un objeto JSON identica al original pero con el producto que buscamos con la ID
                const datosJSON = `  
                    {
                        "productos": [${productoJSON}]
                    }
                `;

                respuesta.writeHead(200, {
                    'Content-Type':'application/json;charset=utf-8',
                    'access-control-allow-origin': '*'
                }); //Status Code y Cabezera

                respuesta.end(datosJSON); //Respondo al cliente
            }
            else{
                respuesta.writeHead(404,{
                    'Content-Type':'text/plain;charset=utf-8',
                    'access-control-allow-origin':'*'
                })
                respuesta.end('Recurso no encontrado')
            }
        }
    })
}



//POST
const CrearProducto = (peticion, respuesta) =>{
    let input = ""; //Input del usuario

    peticion.on('data', (paquetes)=>{input += paquetes}); //Evento que recibe los datos

    peticion.on('error', (error)=>{  //Evento de error
        respuesta.writeHead(500, {
            'Content-Type':'text/plain; charset=utf8',
            'access-control-allow-origin':'*'
        });
        respuesta.end('Error al recibir los datos');
    })

    
    peticion.on('end', ()=>{  
        
        readFile(ruta,(error, datos)=>{ //Leer el archivo
            if(error){
                respuesta.writeHead(404, {
                    'Content-Type':'text/plain',
                    'access-control-allow-origin':'*'
                });
                respuesta.end('Ruta no encontrada')
            }
            else{
                const objetoJSON = JSON.parse(datos) //JSON -> OBJ JS
                
                const objetoUsuario = JSON.parse(input) //Datos enviados por el user -> OBJ JSON
                
                const arrayIds = objetoJSON.productos.map((elemento)=>{return parseInt(elemento.id);}) //Obtener los id en otro array
                
                const id = Math.max(...arrayIds) + 1 //Obtener el id más alto.
                
                const nuevoProducto = { //Construir el nuevo objeto
                    id: parseInt(id),
                    nombre: objetoUsuario.nombre,
                    marca: objetoUsuario.marca,
                    categoria: objetoUsuario.categoria,
                    stock: parseInt(objetoUsuario.stock)
                }
                
                objetoJSON.productos.push(nuevoProducto) //Insertar el nuevo producto al array dentro del objeto
                
                const arrayProductos = JSON.stringify(objetoJSON.productos) //Convertir el array a texto JSON
                
                //Construir el nuevo objeto
                const datoJSON = ` 
                    {
                        "productos": ${arrayProductos}
                    }
                `
               
                writeFile(ruta, datoJSON, (error)=>{  //Escribir el nuevo JSON
                    if(error){
                        respuesta.writeHead(500, {
                            'Content-Type':'text/plain',
                            'access-control-allow-origin':'*'
                        })
                        respuesta.end('Error al crear el recurso')
                    }
                    else{
                        respuesta.writeHead(202, {
                            'Content-Type':'application/json',
                            'access-control-allow-origin':'*'
                        })
                        respuesta.end('Recurso creado')
                    }
                })               
            }
        })
    })
}



//PUT
const editarProducto = (peticion,respuesta) =>{
    const id = parse(peticion.url).base
    let datosCliente = "";

    peticion.on('data',(pedacitos) =>{
        datosCliente += pedacitos
    })
    
    peticion.on('error',()=>{
        respuesta.writeHead(500,{
            'Content-Type':'text/plain',
            'access-control-allow-origin':'*'
        })

        respuesta.end('Error en el servidor')
    })

    peticion.on('end',()=>{
        readFile(ruta,(err,datos)=>{
            if (err) {
                respuesta.writeHead(404,{
                    'Content-Type':'text/plain',
                    'access-control-allow-origin':'*'
                })
                respuesta.end('Error: no se encontro el archivo')
            }
            else{
                const objetoJSON = JSON.parse(datos)  //Pasamos JSON a OBJ JS

                const arrayProductos = objetoJSON.productos; //Obtenemos el array productos[(Objetos)]

                const objetoCliente = JSON.parse(datosCliente) //Pasamos JSON a OBJ JS

                const indice =  arrayProductos.findIndex((producto)=>{return parseInt(producto.id) === parseInt(id)}) //Obtenemos la pos del arreglo

                //console.log(indice)  -> 6 Ya que los arrays empiezan en 0

                arrayProductos[indice] = {  //Editamos el objeto 
                    id: parseInt(id),
                    nombre: objetoCliente.nombre,
                    stock: parseInt(objetoCliente.stock),
                    categoria: objetoCliente.categoria,
                    marca: objetoCliente.marca
                }

                writeFile(ruta,JSON.stringify(objetoJSON),err =>{ //Lo escribimos 
                    if (err) {
                        respuesta.writeHead(404,{
                            'Content-Type':'text/plain',
                            'access-control-allow-origin':'*'
                        })
                        respuesta.end('Error al actualizar el producto')
                    }
                    else{
                        respuesta.writeHead(200,{
                            'Content-Type':'application/json',
                            'access-control-allow-origin':'*'
                        })
                        respuesta.end('Modificado con exito')
                    }

                })

            }
        })
    })
}











//DELETE
const EliminarProducto = (peticion,respuesta)=>{
    const id = parse(peticion.url).base
    readFile(ruta,(err,datos)=>{
        if (err) {
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8',
                'access-control-allow-origin':'*'
            })
            respuesta.end('Recurso no encontrado')
        }
        else{
            const objetoJSON = JSON.parse(datos)  // JSON -> OBJETO JS

            const arrayProductos = objetoJSON.productos //Obtenemos el arreglo de los productos del JSON

            const ArrayProductosN = arrayProductos.filter((producto) => {return parseInt(producto.id) !== parseInt(id)}) //Condicion desigualdad estricta, filter TODOS que cumplan la condicion

            objetoJSON.productos =  ArrayProductosN //Pisamos el objeto JS  con el nuevo array
           
            const datosObjetoJSON = JSON.stringify(objetoJSON);  //OBJETOJS -> JSON

            writeFile(ruta,datosObjetoJSON,err =>{
                if (err) {
                    respuesta.writeHead(500, {
                        'Content-Type':'text/plain',
                        'access-control-allow-origin':'*'
                    });
                    respuesta.end('Ha ocurrido un error al eliminar el producto');
                }
                else{
                    respuesta.writeHead(200, {
                        'Content-Type':'application/json',
                        'access-control-allow-origin':'*'
                    });
                    respuesta.end('Producto eliminado');
                }
            })
        }
    })
}



export {GetTraerJson,GetTraerID,CrearProducto,EliminarProducto,editarProducto}
