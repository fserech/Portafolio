import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@/app/components/shared/navbar/navbar.component';
import { FooterComponent } from '@/app/components/shared/footer/footer.component';
import { AppScrollToTopComponent } from '@/app/components/shared/app-scroll-to-top/app-scroll-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    AppScrollToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Portfolio of Javeed Ishaq - Software Developer';
}
