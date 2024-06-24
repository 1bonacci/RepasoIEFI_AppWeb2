import express from 'express'
// const servidor = ....
const app = express()

// Middlewares
function m1(req,res,next){
    console.log('M1')
    // Siempre debe estar
    next()
}
function m2(req,res,next){
    console.log('M2')
    // Siempre debe estar
    next()
}
// Uso el middleware
// app.use('/mid',m1,m2)

// get
app.get('/',m1,m2,(req,res)=>{
    res.send('Hola')
})
// get
app.get('/mid',(req,res)=>{
    res.send('Hola')
})
// post
app.post('/',(req,res)=>{
    res.send('Hola')
})
app.listen(3000)