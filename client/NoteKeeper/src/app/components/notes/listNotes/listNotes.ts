import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { ListNotesResponse } from '../../../service/notes/models';
import { map } from 'rxjs';

interface NoteViewModel {
  id: string;
  titulo: string;
  icone: string;
  categorias: string[];
  criadoEm: string;
  atualizadoEm: string;
}

function toNoteViewModel(response: ListNotesResponse): NoteViewModel {
  return {
    id: response.id,
    titulo: response.titulo,
    icone: response.icone,
    categorias: response.categorias.map((categoria) => categoria.titulo),
    criadoEm: response.criadoEm,
    atualizadoEm: response.atualizadoEm,
  };
}

@Component({
  selector: 'app-ListNotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listNotes.html',
})
export class ListNotes {
  protected serviceNotes = inject(ServiceNotes);

  protected readonly notes = toSignal(
    this.serviceNotes.list().pipe(map((notes: ListNotesResponse[]) => notes.map(toNoteViewModel))),
  );
}
