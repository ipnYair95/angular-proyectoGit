import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../entity/alumno';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-alumno',
  templateUrl: './buscar-alumno.component.html',
  styleUrls: ['./buscar-alumno.component.css'],
})
export class BuscarAlumnoComponent implements OnInit {

  titulo = "Buscar alumno"

  valor = '';
  error = '';

  alumnos: Alumno[] = [];

  constructor(private as: AlumnoService, private router: Router) {}

  ngOnInit(): void {}

  /**
   * Busqueda de alumno por curp
   * @param texto Curp
   * Retorna la respuesta de registro si o no encontrado o bien error en formato
   */
  porCurp(texto: string) {
    //console.log(` curp ${ texto.trim() } `);
    this.alumnos = [];
    this.as.buscarPorCurp(texto.trim()).subscribe(
      (resp) => {
        console.log( resp );
        this.alumnos.push(resp);

        Swal.fire(
          'Exito',
          `Alumno con CURP ${texto.trim()} encontrado con exito`,
          'success'
        );
      },
      (err) => {
        switch (err.status) {
          case 400:
            Swal.fire('Error', `Formato de CURP invalido`, 'error');
            break;

          case 404:
            Swal.fire('Error', `Registros no encontrados`, 'error');
            break;

          default:
            console.log('Error interno');
        }
      }
    );
  }

  /**
   * Busqueda de alumno por apellidos
   * @param texto Apellido paterno o materno
   * Retorna la respuesta de encontrado o no encontrado
   */
  porApellido(texto: string) {
    this.alumnos = [];
    this.as.buscarPorApellido(texto.trim()).subscribe(
      (resp) => {
        //console.log( resp );
        this.alumnos = resp;
        Swal.fire('Exito', `Registros encontrados`, 'success');
      },
      (err) => {
        console.log(err);
        switch (err.status) {
          case 404:
            Swal.fire('Error', `Registros no encontrados`, 'error');
            break;

          default:
            console.log('Error interno');
        }
      }
    );
  }

  /**
   * Eliminar alumno
   * @param alumno
   * Solamente puede retornar error en caso de no existir
   */
  eliminar(alumno: Alumno) {
    Swal.fire({
      title: `Elminar al alumno  \n ${alumno.apePaterno} ${alumno.apeMaterno} ${alumno.nombre} con id ${alumno.id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.eliminar( alumno.id.toString() ).subscribe(
          (resp) => {
            this.alumnos = this.alumnos.filter((ele) => ele.id != alumno.id);
            Swal.fire('Exito', 'Alumno eliminado', 'success');
          },
          (err) => {
            switch (err.status) {
              case 404:
                Swal.fire('Error', `Registros no encontrados`, 'error');
                break;

              default:
                console.log('Error interno');
            }
          }
        );
      }
    });
  }
}
