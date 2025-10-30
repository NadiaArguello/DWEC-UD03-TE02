export class BienvenidaService {
    //Método elegir Nivel
    //Recibe como parámetro de entrada el nivel según el botón que haya pulsado el jugador
    //Lo almacena en el localStorage y redirige a juego.html
    elegirNivel(nivel) {
        localStorage.setItem('nivelElegido', nivel);
        location.href = './juego.html';
    }
}