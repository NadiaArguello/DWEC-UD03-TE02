export class ResumenService {

    //Método mostrarResultado
    //Recibe el valor de resultado del localStorage y el tiempo restante. 
    //Después, muestra el mensaje de victoria o derrota y carga las imágenes que correspondan a cada caso
    mostrarResultado() {
        const resultado = localStorage.getItem('resultado');
        const tiempoRestante = localStorage.getItem('tiempoRestante') || '00:00';
        const h1 = document.getElementById('texto-resultado');
        const resumen = document.querySelector('.texto-resumen-resultado');
        const tiempoRestanteTexto = document.querySelector('.tiempo-restante');
        const imgIzq = document.getElementById('img-resultado-izq');
        const imgDcha = document.getElementById('img-resultado-dcha');
        const audio = document.getElementById('bgm');

        if (resultado === 'ganado') {
            h1.textContent = '¡HAS GANADO!';
            resumen.innerHTML = `"El cerezo florece solo un instante,<br>
                    pero su belleza vive en quien la contempla.<br>
                    Disfruta la victoria,
                    pues incluso la perfección es solo un suspiro del viento."`;
            tiempoRestanteTexto.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
            imgIzq.style.backgroundImage = `url('../img/ganar_izquierda.png')`;
            imgDcha.style.backgroundImage = `url('../img/ganar_derecha.png')`;
            audio.src = '../audio/Victoria.mp3';
            audio.play();
            audio.volume = 0.3;
        } else {
            h1.textContent = '¡HAS PERDIDO!';
            resumen.innerHTML = `"En el jardín del tiempo, incluso la derrota tiene su flor.<br>
                    El bambú que se dobla no se quiebra.<br>
                    Perder no es el final, sino el susurro del viento que enseña a esperar el siguiente amanecer."`;
            imgIzq.style.backgroundImage = `url('../img/perder_izquierda.png')`;
            imgDcha.style.backgroundImage = `url('../img/perder_derecha.png')`;
            audio.src = '../audio/Derrota.mp3';
            audio.play();
        }
    }
}