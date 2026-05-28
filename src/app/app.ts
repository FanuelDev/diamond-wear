import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <dw-navbar />
    <main>
      <router-outlet />
    </main>
    <dw-footer />
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class App {}
