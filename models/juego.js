export class Juego {

    //Constructor
    constructor(nivel) {
        this.nivel = nivel;
        this.tamanio = this.definirTamanio();
        this.numeroMaximo = this.definirNumeroMaximo();
        this.segundosTotales = this.definirTiempo();
        this.tamanioLetra = this.definirTamanioLetra();
        this.parejasEncontradas = 0;
    }

    //Métodos
    definirTamanio() {
        switch (this.nivel) {
            case 'principiante': return 4;
            case 'intermedio': return 6;
            case 'avanzado': return 8;
            default: return 4;
        }
    }

    definirNumeroMaximo() {
        switch (this.nivel) {
            case 'principiante': return 8;
            case 'intermedio': return 18;
            case 'avanzado': return 32;
            default: return 8;
        }
    }

    definirTiempo() {
        switch (this.nivel) {
            case 'principiante': return 30;
            case 'intermedio': return 90;
            case 'avanzado': return 150;
            default: return 30;
        }
    }

    definirTamanioLetra() {
        switch (this.nivel) {
            case 'principiante': return "6rem";
            case 'intermedio': return "4rem";
            case 'avanzado': return "2.5rem";
            default: return "6rem";
        }
    }

}