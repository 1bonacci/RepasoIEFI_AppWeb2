import express from 'express'
// const servidor = ....
const app = express()

// Manejo verbos y de rutas
app.get('/', (req, res) => {
    console.log(req.url)
    // Codigo de estado
    // res.status(301)
    // Envio drespuesta
    // Finaliza la peticion
    res.status(200).send('<h1>Bienvenido</h1>')
    // res.end('Bienvenido')
})

app.post('/', (req, res) => {
    res.sendStatus(204)
})


app.listen(3000)