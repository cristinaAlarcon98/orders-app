import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      @for (toast of toastService.toasts(); track toast) {
        <div class="toast show mb-2"
          [class.bg-success-subtle]="toast.type === 'success'"
          [class.text-success-emphasis]="toast.type === 'success'"
          [class.bg-danger-subtle]="toast.type === 'error'"
          [class.text-danger-emphasis]="toast.type === 'error'"
        >
          <div class="toast-body">{{ toast.key | translate }}</div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
