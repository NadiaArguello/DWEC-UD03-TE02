import { Juego } from '../models/juego.js';

export class JuegoService {
 
    //Constructor
    constructor() {
        this.juego = new Juego(localStorage.getItem('nivelElegido'));
        this.primeraCelda = null;
        this.segundaCelda = null;
        this.bloquearTablero = false;
        this.pausado = false;
        this.tiempoTemporizador = null;
    }

    //Métodos

    //Método iniciarJuego
    //Llama a los métodos generarTablero, iniciarTemporizador e iniciarContador
    //De esta manera, al llamarlo desde main.js, se inicia una partida al cargar la página
    iniciarJuego() {
        this.generarTablero();
        this.iniciarTemporizador();
        this.iniciarContador();
    }

    //Método iniciarTemporizador
    //Inicia el temporizador de la página "Juego" y, si el temporizador llega a 0 antes de que 
    //el jugador haya encontrado todas las parejas, llama al método perderJuego
    iniciarTemporizador() {
        const tempoReloj = document.querySelector('.temporizador-juego');
        this.tiempoTemporizador = setInterval(() => {
            if (!this.pausado) {
                this.juego.segundosTotales--;
                const minutos = Math.floor(this.juego.segundosTotales / 60);
                const segundos = this.juego.segundosTotales % 60;
                tempoReloj.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
                if (this.juego.segundosTotales <= 0) this.perderJuego();
            }
        }, 1000);
    }

    //Toma como parámetro de entrada el número máximo definido en función del nivel que haya seleccionado el jugador
    //Devolverá un array con todos los números enteros desde el 1 hasta el número máximo, repetidos 2 veces.
    //Después, desordena aleatoriamente los números*/
    generarIconos() {
        const numeros = [];
        for (let i = 1; i <= this.juego.numeroMaximo; i++) {
            numeros.push(i, i);
        }
        return numeros.sort(() => Math.random() - 0.5);
    }

    //Método generarTablero
    //Guarda un array de iconos llamando al método generarIconos
    //Crea un tablero del tamaño definido en la variable tamanio, en función del nivel elegido
    //Aplica estilos al tablero y llena el tablero con los iconos
    //Añade un oyente para que llame al método gestionarClickCelda al pulsar en cada celda
    generarTablero() {
        const iconos = this.generarIconos();
        const contenedor = document.getElementById('tablero-juego');
        contenedor.innerHTML = '';
        const tablero = document.createElement('table');

        let indiceIcono = 0;
        for (let i = 0; i < this.juego.tamanio; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < this.juego.tamanio; j++) {
                const celda = document.createElement('td');
                celda.classList.add('cell', 'oculta');
                celda.style.border = "4px solid white";
                celda.style.borderRadius = "5px";
                celda.textContent = '?';
                celda.style.color = "white";
                celda.style.fontWeight = "bold";
                celda.style.fontSize = this.juego.tamanioLetra;
                celda.dataset.icono = iconos[indiceIcono++];
                celda.addEventListener('click', e => this.gestionarClickCelda(e));
                fila.appendChild(celda);
            }
            tablero.appendChild(fila);
        }
        contenedor.appendChild(tablero);
    }

    //Método gestionarClickCelda
    //Al hacer click en una celda, cambia el color a gris, cambia la imagen de fondo para mostrar el icono que le corresponde
    //y oculta el símbolo "?". Cuando se hace click en la segunda celda, bloquea el tablero para que el jugador no pueda seguir pulsando celdas hasta que se haya verificado la coincidencia
    //Llama al método verificarCoincidencia para saber si los iconos de las celdas coinciden.
    gestionarClickCelda(event) {
        if (this.bloquearTablero) return;
        const celda = event.target;
        
        // Si la celda ya está bloqueada (pareja encontrada), no hacer nada
        if (celda.classList.contains('bloqueada')) return;

        if (celda === this.primeraCelda) return;

        // Quitar clase 'oculta' y añadir 'descubierta'
        celda.classList.remove('oculta');
        celda.classList.add('descubierta');

        // Mostrar icono
        celda.style.backgroundColor = "grey";
        celda.style.backgroundImage = `url('../img/img_tablero/${celda.dataset.icono}.png')`;
        celda.innerHTML = '&nbsp;';

        if (!this.primeraCelda) {
            this.primeraCelda = celda;
            return;
        }

        this.segundaCelda = celda;
        this.bloquearTablero = true; // Bloquea el tablero mientras se procesa el match
        this.verificarCoincidencia();
    }

    //Método verificarCoincidencia
    //Comprueba si los iconos de las celdas coinciden. Si coinciden, deshabilita las celdas llamando al método deshabilitarCeldas, 
    //actualiza el contador de parejas encontradas llamando al método actualizarContador y verifica si ha ganado la partida llamando al método  verificarVictoria
    //Si no coinciden, llama al método ocultarCeldas para volver a ocultar los iconos
    verificarCoincidencia() {
        const coincidencia = this.primeraCelda.dataset.icono === this.segundaCelda.dataset.icono;
        if (coincidencia) {
            this.deshabilitarCeldas();
            this.actualizarContador();
            this.verificarVictoria();
        } else {
            this.ocultarCeldas();
        }
    }

    //Método deshabilitarCeldas
    //Si las dos celdas elegidas por el jugador han tenido el mismo icono, les añade la clase "bloqueada" para que no pueda volver a clickarse en ellas
    //Después llama al método resetearTablero para que se desbloquee y el jugador pueda seguir jugando
    deshabilitarCeldas() {

        this.primeraCelda.classList.add('bloqueada');
        this.segundaCelda.classList.add('bloqueada');
        this.resetearTablero();
    }

    //Método ocultarCeldas
    //Si las dos celdas elegidas por el jugador NO han tenido el mismo icono, borra los iconos, recupera el símbolo "?" y el color inicial de la celda
    //Además, vuelve a definir la clase de las celdas como "oculta" para que siga haciendo el efecto de ampliarse y brillo definidos en el css al pasar el ratón por encima de la celda
    //Después llama al método resetearTablero para que se desbloquee y el jugador pueda seguir jugando
    ocultarCeldas() {
        setTimeout(() => {
            this.primeraCelda.style.backgroundImage = '';
            this.segundaCelda.style.backgroundImage = '';
            this.primeraCelda.style.backgroundColor = "#07d5e7";
            this.segundaCelda.style.backgroundColor = "#07d5e7";
            this.primeraCelda.textContent = "?";
            this.segundaCelda.textContent = "?";

            // Volver a poner clase 'oculta'
            this.primeraCelda.classList.remove('descubierta');
            this.segundaCelda.classList.remove('descubierta');
            this.primeraCelda.classList.add('oculta');
            this.segundaCelda.classList.add('oculta');

            this.resetearTablero();
        }, 500);
    }

    //Método resetearTablero
    //Después de que se haya bloqueado el tablero para verificar si las celdas elegidas por el jugador coinciden, lo desbloquea para que pueda seguir jugando
    resetearTablero() {
        [this.primeraCelda, this.segundaCelda, this.bloquearTablero] = [null, null, false];
    }

    //Método verificarVictoria
    //Verifica si el jugador ha encontrado todas las celdas, al comprobar que todas tienen una imagen de fondo (Es decir, todas están dadas vuelta)
    //Almacena el resultado ganado y el tiempo restante.
    //Muestra una alerta indicándole al jugador que ha ganado la partida
    //Después, le redirige a resumen.html
    verificarVictoria() {
        const todasLasCeldas = document.querySelectorAll('.cell');
        const todasCoinciden = Array.from(todasLasCeldas).every(cell => cell.style.backgroundImage !== '');
        if (todasCoinciden) {
            clearInterval(this.tiempoTemporizador);
            localStorage.setItem('resultado', 'ganado');
            localStorage.setItem('tiempoRestante', this.juego.segundosTotales);
            setTimeout(() => {
                alert('¡Felicidades! Has encontrado todas las parejas.');
                location.href = '../web/resumen.html';
            }, 500);
        }
    }

    //En caso de que se haya acabado el tiempo sin que el jugador haya encontrado todas las parejas
    //Almacena el resultado perdido y el tiempo restante, que es cero
    //Muestra una alerta indicándole al jugador que se ha agotado el tiempo
    //Después, le redirige a resumen.html
    perderJuego() {
        clearInterval(this.tiempoTemporizador);
        localStorage.setItem('resultado', 'perdido');
        localStorage.setItem('tiempoRestante', '00:00');
           setTimeout(() => {
                alert('¡Se acabó el tiempo! No has encontrado todas las parejas.');
                location.href = '../web/resumen.html';
            }, 500);
    }

    //Método iniciarContador
    //Inicia el contador de parejas encontradas, según el nivel de dificultad
    iniciarContador() {
        document.querySelector('.pares-encontrados').textContent = this.juego.numeroMaximo;
    }

    //Método actualizar contador
    //Se le llama cuando el jugador ha encontrado una pareja. Resta uno al contador de parejas encontradas
    actualizarContador() {
        const contador = document.querySelector('.pares-encontrados');
        contador.textContent = parseInt(contador.textContent) - 1;
    }
}