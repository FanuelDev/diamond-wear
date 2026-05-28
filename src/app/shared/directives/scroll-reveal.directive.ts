import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[dwReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() dwReveal: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' = 'fade';
  @Input() dwDelay = 0;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.style.opacity = '0';
    el.style.transition = `opacity 0.7s ease ${this.dwDelay}ms, transform 0.7s ease ${this.dwDelay}ms`;

    switch (this.dwReveal) {
      case 'slide-up':    el.style.transform = 'translateY(40px)'; break;
      case 'slide-left':  el.style.transform = 'translateX(-40px)'; break;
      case 'slide-right': el.style.transform = 'translateX(40px)'; break;
      case 'scale':       el.style.transform = 'scale(0.9)'; break;
      default:            break;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          this.observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
