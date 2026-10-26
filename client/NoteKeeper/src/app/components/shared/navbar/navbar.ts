import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProvideUser } from '../../auth/provideUser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly provideUser = Inject(ProvideUser);
}
