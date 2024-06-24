import express from 'express'
// const servidor = ....
const app = express()

app.get('/productos',(req,res)=>{
    // Enviamos un JSON
    res.json({prducto:"Zapatilla"})
})


app.listen(3000)