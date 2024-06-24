import express from 'express'
import pg from 'pg'
//para variables de entorno
import dotenv from 'dotenv'
//para los cors
import cors from 'cors'
import helmet from 'helmet' //Inserta cabeceras de seguridad


//cargamos el archivo .env con todas las variables 
dotenv.config()

//Obtenemos las variables
// const PUERTO = process.env.PUERTO || 3333
// const PG_USER = process.env.PG_USER
// const PG_PASS = process.env.PG_PASS


const {Pool} = pg


const pool = new Pool({
  host: 'localhost', // -> 192.169.0.86
  user: 'root',
  database: 'tienda',
  port: 5432,
  password: 'pass',

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// instancia express
const app = express();

//Middleware
app.use(express.json()) //Vamos a capturar un JSON desde el cliente, formato JSON{ }
app.use(express.urlencoded({extended:true})) //formato url encode   producto=nombre&precio=1000
app.use(helmet()) //cabeceras de seguridad

//SERVIDOR ESTATICO FRONT(publica) 
app.use(express.static('publica'))

// Consulta
app.get('/productos',cors(),async (req,res)=>{
  try{

    const resultado = await pool.query('SELECT * FROM productos')
    console.log(resultado.rows)
    res.json(resultado.rows) //.json = darle cabecera 
  }catch(error){

    res.status(404).end()
  }
})

app.get('/productos/:id',cors(),async (req,res)=>{
  const id = req.params.id
  const resultado = await pool.query('SELECT * FROM productos WHERE id=$1',[id])
  res.json(resultado.rows)
})


app.delete('/productos/:id', async (req,res)=>{
  const id = req.params.id
  const resultado = await pool.query('DELETE FROM productos WHERE id=$1',[id])
  res.send('Borrado')
})


app.post('/productos', async (req,res)=>{
  const producto = req.body.producto
  const precio = req.body.precio
  const resultado = await pool.query('INSERT INTO productos (producto, precio) VALUES($1,$2) ',[producto,precio])
  console.log(resultado.rows)
  res.send('Producto cargado correctamente')
})


app.put('/productos/:id', async (req,res)=>{
  const id = req.params.id
  const producto = req.body.producto
  const precio = req.body.precio
  const resultado = await pool.query('UPDATE productos SET producto = $1, precio = $2 WHERE id = $3 ',[producto,precio,id])
  console.log(resultado.rows)
  res.send('Producto actualizado correctamente')
})


// Iniciamos la escucha
app.listen(3000)