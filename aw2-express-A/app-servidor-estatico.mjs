import express from 'express'
// const servidor = ....
const app = express()

// Servir recursos
app.use(express.static('publica'))


app.listen(3000)