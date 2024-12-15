import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { AnimationLottieComponent } from '@/app/components/shared/animation-lottie/animation-lottie.component';
import { experiences } from '@/utils/data/experience';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, AnimationLottieComponent, FontAwesomeModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  experiences = experiences;
  workIcon = faBriefcase;
  lottieFile = '/assets/lottie/code.json'; // Make sure to move the lottie file to assets
}