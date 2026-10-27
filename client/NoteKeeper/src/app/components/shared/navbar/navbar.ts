import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProvideUser } from '../../../auth/provideUser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(protected provideUser: ProvideUser) {}

  protected readonly dropdownOpen = signal(false);

  // Mantenha a injeção existente do provideUser.

  protected logout(): void {
    this.dropdownOpen.set(false);
    this.provideUser.logout();
  }
}
