import { Component } from '@angular/core';
import { Eye, LucideAngularModule, ArrowRight, Github, Linkedin, Mail, Code2, LucideIconData, ShieldCheck } from 'lucide-angular';



@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucideAngularModule, ],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
  readonly Github     = Github;
  readonly Linkedin   = Linkedin;
  readonly Mail       = Mail;
  readonly Code2      = Code2;
  readonly ShieldCheck = ShieldCheck;
  readonly Eye         = Eye;
  readonly cvUrl = 'https://drive.google.com/file/d/1Om2ADXG8zJvoqQq7SadWXBku6VHT2_GX/view?usp=sharing';
}