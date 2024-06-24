import express from 'express'
// const servidor = ....
// El objeto "process"
const PUERTO = process.env.PUERTO || 3001

const app = express()

app.get('/',(req,res)=>{
    console.log(PUERTO)
    res.send('Mi variable es ' + PUERTO)
})


app.listen(PUERTO)