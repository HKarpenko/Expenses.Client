import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  /** Size of the spinner diameter in pixels */
  @Input() size: number = 40;

  /** Primary color of the spinning border */
  @Input() color: string = '#3b82f6'; // Default primary blue

  /** Thickness of the spinner ring in pixels */
  @Input() borderWidth: number = 4;

  /** Optional text message below the spinner */
  @Input() message?: string;

  /** Color of the message text */
  @Input() textColor: string = '#4b5563';

  /** Covers the immediate parent container (requires parent to have position: relative) */
  @Input() overlay: boolean = false;

  /** Covers the entire viewport fixed on top of all elements */
  @Input() fullscreen: boolean = false;
}