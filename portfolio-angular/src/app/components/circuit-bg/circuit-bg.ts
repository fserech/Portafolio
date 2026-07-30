import { Component, Input, inject } from '@angular/core';

import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-circuit-bg',
  standalone: true,
  imports: [],
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