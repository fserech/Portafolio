import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { AnimationLottieComponent } from '@/app/components/shared/animation-lottie/animation-lottie.component';
import { educations } from '@/utils/data/educations';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, AnimationLottieComponent, FontAwesomeModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {
  educations = educations;
  workspaceIcon = faGraduationCap;
  lottieFile = '/assets/lottie/study.json'; // Make sure to move the lottie file to assets
}