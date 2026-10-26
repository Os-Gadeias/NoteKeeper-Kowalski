import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-createUser',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './createUser.html',
})
export class CreateUser {}
