import {createServer} from 'node:http'
import { GetTraerJson,GetTraerID,EliminarProducto, CrearProducto,editarProducto} from './funciones.mjs';



const servidor = createServer((peticion,respuesta)=>{

    if(peticion.method === 'OPTIONS'){
        respuesta.writeHead(200,{
            'access-control-allow-origin':'*',
            'access-control-allow-methods':'GET,POST,PUT,DELETE',
            'access-control-allow-headers':'Content-Type'
        })
        return respuesta.end();
    }
    
    
    if (peticion.method === 'GET') {  //OBTENER
        //Obtener todos los productos
        if (peticion.url === '/v1/productos') {
            GetTraerJson(respuesta)
        }
        
        else if (peticion.url.match('/v1/productos')) { //Obtener 1 producto por su ID
            GetTraerID(peticion,respuesta)
        }
        else{
            respuesta.writeHead(404,
                'Content-Type','text/plain;charset=utf-8')

            respuesta.end('La ruta no existe')
        }
    }
    else if (peticion.method === 'POST') { //CREAR
        if (peticion.url === '/v1/productos') {
            CrearProducto(peticion,respuesta)
        }
        else{
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8'
            })

            return respuesta.end('La ruta no existe')
        }
        
    }
    else if (peticion.method === 'PUT') { //MODIFICAR
        //Modificar porducto por su ID
        if (peticion.url.match('/v1/productos')) {
            editarProducto(peticion,respuesta)
        }
        else{
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8'}
            )
            return respuesta.end('La ruta no existe')
        }        
    }
    else if (peticion.method === 'DELETE') { //ELIMINAR
        //Eliminar porducto por su ID
        if (peticion.url.match('/v1/productos')) {
            EliminarProducto(peticion,respuesta)
        }
        else{
            respuesta.writeHead(404,{
                'Content-Type':'text/plain;charset=utf-8',
            })

            return respuesta.end('La ruta no existe')
        } 
    }
    else{
        respuesta.writeHead(404,{
            'Content-Type':'text/plain;charset=utf-8'
        })
        return respuesta.end('Metodo incorrecto')
    }
})


servidor.listen(3000)