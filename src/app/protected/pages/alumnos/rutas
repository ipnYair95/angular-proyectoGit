
import { Routes } from '@angular/router'; 
import { ListarTodosComponent } from './components/listar-todos/listar-todos.component';
import { BuscarAlumnoComponent } from './components/buscar-alumno/buscar-alumno.component';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno.component';

export const rutasAlumno: Routes = [
    { path: 'listar', component: ListarTodosComponent },
    { path: 'buscar', component: BuscarAlumnoComponent },
    { path: 'crear', component: CrearAlumnoComponent },
    { path: 'crear/:id', component: CrearAlumnoComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'buscar'  }
];
 