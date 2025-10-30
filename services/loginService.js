import { Usuario } from '../models/usuarios.js';

export class LoginService {
    //Constructor
    constructor() {
        this.usuarios = [];
        this.init();
    }

    //Métodos
    //Método init. Carga los datos de usuarios del json y los guarda en el array usuarios
    async init() {
        const response = await fetch('./data/usuarios.json');
        this.usuarios = await response.json();
    }

    //Método validarLogin
    //Recibe como parámetros de entrada el usuario y contraseña introducidos por el usuario
    //Verifica que la contraseña sea alfanumérica. En caso de que no, devuelve un mensaje
    //Si la contraseña es alfanumérica, comprueba que el usuario coincide con alguno de los del json y que la contraseña es la que le corresponde
    //Si hay algo mal, devuelve el mensaje de usuario o contraseña incorrectos
    validarLogin(usuario, contrasenia) {

        const regex = /^[a-zA-Z0-9]+$/ //Para decirle que la contraseña debe ser alfanumérica usando RegExp

        if (!regex.test(contrasenia)) {
            return { valido: false, mensaje: 'La contraseña debe ser alfanumérica.' };
        }

        const usuarioValido = Usuario.validar(usuario, contrasenia, this.usuarios);
        if (usuarioValido) {
            localStorage.setItem('usuarioActual', usuario);
            return { valido: true };
        } else {
            
            return { valido: false, mensaje: 'Usuario o contraseña incorrectos.' };
        }
    }
}