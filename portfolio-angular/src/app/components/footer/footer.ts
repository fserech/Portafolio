import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Github, Linkedin, Twitter, Heart, Mail, MapPin, Globe } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  readonly Github = Github;
  readonly Linkedin = Linkedin;
  readonly Twitter = Twitter;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Globe = Globe;
  readonly Heart = Heart;


  currentYear = new Date().getFullYear();
}
