import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Github, Linkedin, Mail } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  readonly Github   = Github;
  readonly Linkedin = Linkedin;
  readonly Mail     = Mail;

  modeService = inject(ModeService);
  currentYear = new Date().getFullYear();
}
