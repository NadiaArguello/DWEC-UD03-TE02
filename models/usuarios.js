export class Usuario {

    //Constructor
    constructor(usuario, contrasenia) {
        this.usuario = usuario;
        this.contrasenia = contrasenia;
    }

    //Métodos
    static validar(usuario, contrasenia, listaUsuarios) {
        return listaUsuarios.find(u => u.usuario === usuario && u.contrasenia === contrasenia);
    }
}