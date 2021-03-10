import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GruposComponent } from '../grupos.component';
import { Historial } from '../../../../../alumnos/entity/historial';
import { Grupo } from '../../../models/grupos';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Notificaciones, Opcion } from '../../../../../../../ayudas/notificaciones';
import { HistorialService } from '../../../../../alumnos/services/historial.service';

@Component({
  selector: 'app-cambio-grupo',
  templateUrl: './cambio-grupo.component.html',
  styleUrls: ['./cambio-grupo.component.css']
})
export class CambioGrupoComponent {

  forma: FormGroup;
  nombreCompleto;

  constructor(
    private historialService: HistorialService,
    public dialogRef: MatDialogRef<GruposComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    const { nombre, apePaterno, apeMaterno } = data.historial.alumno;
    this.nombreCompleto = nombre + " " + apePaterno + " " + apeMaterno;

    this.forma = this.fb.group({
      grupo: [null]
    });

  }


  close(accion: boolean): void {

    const valor: Grupo = this.forma.get('grupo').value;
    if (accion) {

      if (valor == null) {
        Notificaciones.enviarNotificacion(Opcion.errorCustom, "Debe seleccionar un grupo");
        return;
      }

      Notificaciones.enviarNotificacion(Opcion.confirma, `Desea cambiar al alumno al grupo ${valor.nombreGrupo} `).then(resp => {

        if (resp === 1) {
          this.data.historial.idGrupo = valor.id;
          console.log(this.data.historial);
          this.historialService.cambiarGrupo(this.data.historial).subscribe(resp => {

            if (resp != false) {
              this.dialogRef.close(accion);
              return;
            }

          });
          return;
        }
      });

    } else {
      this.dialogRef.close(accion);
    }

  }

  sort(model: Grupo[]) {
    return model.sort((a, b) => (a.nombreGrupo > b.nombreGrupo ? 1 : a.nombreGrupo === b.nombreGrupo ? 0 : -1));
  }

}

class Data {
  historial: Historial;
  grupos: Grupo[];
  grupoActual: string;
}
