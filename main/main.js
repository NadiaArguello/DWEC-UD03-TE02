// ------------------------------  CARGA INICIAL DE DATOS --------------------------

document.addEventListener('DOMContentLoaded', async () => {
    const page = window.location.pathname.split('/').pop() || 'index.html'; //Guarda en una constante la página actual

    //En función de cual es la página actual, ejecutará unas órdenes u otras
    switch (page) {
        case 'index.html': {
            //Crea un objeto de la clase LoginService
            const { LoginService } = await import('../services/loginService.js');
            const vm = new LoginService();

            await vm.init(); // Carga de datos de usuarios.json

            /*Cuando se hace click en el botón del formulario, valida el usuario y la contraseña
            usando la función validarLogin de la clase LoginService, y lo almacena en la constante resultado*/
            document.getElementById('boton-login').addEventListener('click', (e) => {
                e.preventDefault();

                const usuario = document.getElementById('usuario').value;
                const password = document.getElementById('password').value;
                const resultado = vm.validarLogin(usuario, password);

                const mensajeLogin = document.getElementById('mensaje-login');
                const loginIncorrecto = document.getElementById('login-incorrecto');

                /*Si el login es correcto, redirecciona a bienvenida.html. Si no, muestra el mensaje
                de login incorrecto o el que dice que la contraseña no cumple la estructura establecida*/
                if (resultado.valido) {
                    location.href = './web/bienvenida.html';
                } else {
                    loginIncorrecto.style.display = 'flex';
                    loginIncorrecto.style.opacity = '1';
                    mensajeLogin.textContent = resultado.mensaje;
                }
            });
            break;
        }
    
        case 'bienvenida.html': {
            //Crea un objeto de la clase BienvenidaService
            const { BienvenidaService } = await import('../services/bienvenidaService.js');
            const vm = new BienvenidaService();

            /*Lee el nivel según el botón pulsado y utiliza el método elegirNivel
            de la clase BienvenidaService para almacenarlo en el LocalStorage y 
            redirigir al jugador a juego.html*/
            document.querySelectorAll('.boton-nivel').forEach(boton => {
                boton.addEventListener('click', () => {
                    const nivel = boton.dataset.nivel;
                    vm.elegirNivel(nivel);
                });
            });
            break;
        }

        case 'juego.html': {
            /*Crea un objeto de la clase JuegoService y llama al método iniciarJuego de la clase
            para iniciar una partida nueva*/
            const { JuegoService } = await import('../services/juegoService.js');
            const vm = new JuegoService();
            vm.iniciarJuego();

            /*Si el jugador coloca el ratón encima del botón pausa, detiene el temporizador
            Y si lo retira, reanuda el temporizador*/ 
            document.querySelector('.boton-pausa').addEventListener('mouseenter', () => vm.pausado = true);
            document.querySelector('.boton-pausa').addEventListener('mouseleave', () => vm.pausado = false);
        
            /*Si el jugador hace click sobre el botón de reiniciar, muestra un mensaje confirmación
            Entonces recarga la página y reinicia el juego*/
            const botonReiniciar = document.querySelector('.boton-recarga');

            botonReiniciar.addEventListener('click', () => {
                const confirmar = confirm("¿Estás seguro de que quieres reiniciar la partida?");
                if (confirmar) {
                    location.reload();
                }
            });
            break;
        }

        case 'resumen.html': {
            /*Crea un objeto de la clase ResumenService y ejecuta el método mostrarResultado*/
            const { ResumenService } = await import('../services/resumenService.js');
            const vm = new ResumenService();
            vm.mostrarResultado();
            break;
        }
    }

});
