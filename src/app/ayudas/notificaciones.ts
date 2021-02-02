import Swal from 'sweetalert2';

export class Notificaciones{   


    static enviarNotificacion( notificacion: Opcion, texto? : string ){

        switch( notificacion ){

            case Opcion.error:
                Swal.fire('error','Ha ocurrido un error','error')
            break;

            case Opcion.errorCustom:
                Swal.fire('error', texto ,'error')
            break;

            case Opcion.exitoCustom:
                Swal.fire('Exito', texto ,'success')
            break;

            case Opcion.exitoCustomReload:
                Swal.fire('Exito', texto ,'success').then( then => window.location.reload() )
            break;

        }

    }

}

export enum Opcion{
    error = 'error',
    errorCustom = 'errorCustom',
    exitoCustom = 'exitoCustom',
    exitoCustomReload = 'exitoCustomReload'

}