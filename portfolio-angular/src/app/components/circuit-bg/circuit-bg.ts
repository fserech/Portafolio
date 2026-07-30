import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-circuit-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circuit-bg.html',
  styleUrls: ['./circuit-bg.scss']
})
export class CircuitBgComponent {
  @Input() ambient = false;

  modeService = inject(ModeService);

  get isSecurity() {
    return this.modeService.activeMode() === 'security';
  }
}