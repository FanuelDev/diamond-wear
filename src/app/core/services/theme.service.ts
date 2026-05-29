import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(
    (localStorage.getItem('dw-theme') as Theme) ?? 'dark'
  );

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      const t = this._theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('dw-theme', t);
    });
    document.documentElement.setAttribute('data-theme', this._theme());
  }

  toggle(): void {
    this._theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
