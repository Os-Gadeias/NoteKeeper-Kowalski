import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../app/components/shared/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
    }

    app-navbar,
    app-footer {
      flex-shrink: 0;
    }
  `,
})
export class App {
  protected readonly title = signal('NoteKeeper');
}
