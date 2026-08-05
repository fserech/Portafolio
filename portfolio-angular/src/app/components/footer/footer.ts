import { Component } from '@angular/core';
import { LucideAngularModule, Github, Linkedin, Mail } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  readonly Github   = Github;
  readonly Linkedin = Linkedin;
  readonly Mail     = Mail;

  currentYear = new Date().getFullYear();
}