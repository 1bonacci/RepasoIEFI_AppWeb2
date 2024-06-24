import express from 'express';
// const servidor = ....
const app = express();

const rutasFront = express.Router();
const rutasLogin = express.Router();

// app.use(rutasFront, rutasLogin);
app.use('/front',rutasFront);
app.use(rutasLogin);
// /consola/login
// /consola/admin

// Front
rutasFront.get('/',(req,res)=>{
    console.log('front')
    res.send('Home')
})
rutasFront.get('/contacto',(req,res)=>{
    console.log('contacto')
    res.send('Contacto')
})

// Acceso privado
rutasLogin.get('/login',(req,res)=>{
    console.log('Admin')
    res.send('login')
})
rutasLogin.get('/consola',(req,res)=>{

})
rutasLogin.post('/productos')

// app.route('/')
//     .get((req, res) => {
//         console.log('get');
//         res.send('GET /');
//     })
//     .post((req, res) => {
//         console.log('post');
//         res.send('POST /');
//     });

app.listen(3000);
