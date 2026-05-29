import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { filter } from 'rxjs';

/** Routes qui ont leur propre header — on masque la navbar et le footer globaux */
const STANDALONE_ROUTES = ['/checkout', '/order-confirmation'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    @if (showChrome()) {
      <dw-navbar />
    }
    <main>
      <router-outlet />
    </main>
    @if (showChrome()) {
      <dw-footer />
    }
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class App {
  private router = inject(Router);
  showChrome = signal(true);

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      const url = e.urlAfterRedirects;
      this.showChrome.set(
        !STANDALONE_ROUTES.some(p => url.startsWith(p))
      );
    });
  }
}
