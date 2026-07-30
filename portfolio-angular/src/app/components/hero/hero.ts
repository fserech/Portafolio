import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight, Github, Linkedin, Mail, Terminal, Shield, Code2 } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
  readonly Github     = Github;
  readonly Linkedin   = Linkedin;
  readonly Mail       = Mail;
  readonly Terminal   = Terminal;
  readonly Shield     = Shield;
  readonly Code2      = Code2;

  modeService = inject(ModeService);
}