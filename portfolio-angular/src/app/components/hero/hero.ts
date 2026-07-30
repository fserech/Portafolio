import { Component, inject } from '@angular/core';

import { LucideAngularModule, ArrowRight, Github, Linkedin, Mail, Terminal, Shield, Code2 } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucideAngularModule],
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