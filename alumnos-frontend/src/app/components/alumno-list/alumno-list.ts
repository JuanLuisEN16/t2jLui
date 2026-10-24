import { Component, OnInit, inject, signal } from '@angular/core';
import { AlumnoService } from '../../services/alumno';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-alumno-list',
  imports: [],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {
  private alumnoService = inject(AlumnoService);

  alumnos = signal<Alumno[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.');
        this.cargando.set(false);
      }
    });
  }

  eliminar(alumno: Alumno): void {
    if (alumno.id === undefined) return;
    if (!confirm(`¿Eliminar al alumno ${alumno.nombres}?`)) return;

    this.alumnoService.eliminar(alumno.id).subscribe({
      next: () => {
        this.alumnos.update(lista => lista.filter(a => a.id !== alumno.id));
      },
      error: () => this.error.set('No se pudo eliminar el alumno.')
    });
  }
}