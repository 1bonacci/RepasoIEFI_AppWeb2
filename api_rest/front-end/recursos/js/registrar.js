// Contenedor mensajes
const contenedorMensaje = document.getElementById('mensaje-accion');
// Funciones -------------------------
const mostrarMensajeOk = (mensaje) => {
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.display = 'block';
    contenedorMensaje.classList.add('mensaje-accion-ok');
};
const mostrarMensajeAlerta = (mensaje) => {
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.display = 'block';
    contenedorMensaje.classList.add('mensaje-accion-alerta');
};
const registrarProducto = () => {
    // Formulario
    const formulario = document.getElementById('formulario-nuevo');
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const datosCrudos = new FormData(formulario);
        const datosFormulario = Object.fromEntries(datosCrudos);
        const cuerpo = JSON.stringify(datosFormulario);
        const respuesta = await fetch(
            `http://localhost:3000/v1/productos`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: cuerpo,
            },
        );
        if (respuesta.ok) {
            mostrarMensajeOk('Producto dado de alta');
            formulario.reset();
        } else {
            // El código 400 hace referencia a
            // que el usuario no envio todos los datos
            // Esto lo deben verificar uds. del lado del servidor
            if (respuesta.status === 400) {
                mostrarMensajeAlerta('Datos incompletos');
            } else {
                mostrarMensajeAlerta('Error desconocido');
            }
        }
    });
};
// ---------------------------------------------------------
// Invocar funciones ---------------------------------------
// ---------------------------------------------------------
registrarProducto();
// Animaciones
contenedorMensaje.addEventListener('animationend', () => {
    // contenedorMensaje.classList.add('mensaje-accion-alerta');
    contenedorMensaje.style.display = 'none';
});
